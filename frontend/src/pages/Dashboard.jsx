import React, { useState, useRef, useEffect } from "react";
import NavbarDashboard from "../components/NavbarDashboard";
import ScannerViewfinder from "../components/dashboard/ScannerViewfinder";
import ControlBar from "../components/dashboard/ControlBar";
import ResultConsole from "../components/dashboard/ResultConsole";
import PieChartCard from "../components/dashboard/PieChartCard";
import LeaderboardSection from "../components/dashboard/LeaderboardSection";
import QuestionnaireModal from "../components/dashboard/QuestionnaireModal";
import { FOCUS_W, FOCUS_H, leaderboardUsers, leaderboardBeaches } from "../constants/dashboardData";
import { classifyImage, getQuestionnaire, submitScan } from "../services/scanService";

const Dashboard = () => {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [scanStep, setScanStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [capturedImg, setCapturedImg] = useState(null);
  const [capturedFile, setCapturedFile] = useState(null);

  // ── GPS State ──
  const [gpsCoords, setGpsCoords] = useState(null);
  const [gpsError, setGpsError] = useState(null);
  const [locationName, setLocationName] = useState(null);

  // ── Kuesioner Modal State ──
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [questionnaireQuestions, setQuestionnaireQuestions] = useState([]);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);

  // ── Scan Result ──
  const [scanResult, setScanResult] = useState(null);

  // ── GPS auto-capture on mount ──
  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation tidak didukung browser ini");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setGpsCoords(coords);

        // Reverse geocoding via Nominatim (OpenStreetMap)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json&accept-language=id`
          );
          const data = await res.json();
          if (data.display_name) {
            setLocationName(data.display_name);
          }
        } catch {
          // Silent fail — GPS coordinates still work
        }
      },
      (err) => {
        setGpsError("Izin lokasi ditolak: " + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // ── Camera auto-start ──
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (!mounted) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraActive(true);
      } catch {
        if (mounted) { setCameraError("Izin kamera ditolak"); setCameraActive(false); }
      }
    };
    init();
    return () => {
      mounted = false;
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const triggerFileUpload = () => fileInputRef.current?.click();

  // ── Capture frame from video → File object ──
  const captureFrameAsFile = () => {
    if (!videoRef.current || !streamRef.current) return null;
    const video = videoRef.current;
    const fullW = video.videoWidth;
    const fullH = video.videoHeight;
    if (!fullW || !fullH) return null;

    const cropX = Math.round(((100 - FOCUS_W) / 2 / 100) * fullW);
    const cropY = Math.round(((100 - FOCUS_H) / 2 / 100) * fullH);
    const cropW = Math.round((FOCUS_W / 100) * fullW);
    const cropH = Math.round((FOCUS_H / 100) * fullH);

    const canvas = document.createElement("canvas");
    canvas.width = cropW;
    canvas.height = cropH;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(null); return; }
          const file = new File([blob], `scan_${Date.now()}.jpg`, { type: "image/jpeg" });
          resolve(file);
        },
        "image/jpeg",
        0.92
      );
    });
  };

  // ═══════════════════════════════════════════════════════════════
  // STEP 1 → STEP 2: Capture → Classify → Fetch Questionnaire → Open Modal
  // ═══════════════════════════════════════════════════════════════
  const handleStartAnalysis = async (e) => {
    if (isAnalyzing) return;

    let photoFile = null;

    // If triggered by file input change event, use the uploaded file
    if (e?.target?.files?.[0]) {
      photoFile = e.target.files[0];
      // Create preview URL
      setCapturedImg(URL.createObjectURL(photoFile));
    } else {
      // Capture from camera
      photoFile = await captureFrameAsFile();
      if (photoFile) {
        setCapturedImg(URL.createObjectURL(photoFile));
      }
    }

    if (!photoFile) return;

    setCapturedFile(photoFile);

    // Stop camera
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);

    // Step 1: Classify image via backend
    setIsAnalyzing(true);
    try {
      const cvResult = await classifyImage(photoFile);
      const category = cvResult.predicted_class; // e.g. "plastic"
      const categoryUpper = category.toUpperCase();

      // Step 2: Fetch questionnaire from backend
      try {
        const questionnaireData = await getQuestionnaire(category);
        setQuestionnaireQuestions(questionnaireData.questions || []);
      } catch {
        setQuestionnaireQuestions([]);
      }

      setCurrentCategory(categoryUpper);
      setQuestionnaireAnswers({});
      setQuestionIndex(0);
      setShowModal(true);
    } catch (err) {
      console.error("Classification failed:", err);
      // Fallback: still open questionnaire with generic questions
      setCurrentCategory("PLASTIC");
      setQuestionnaireQuestions([]);
      setQuestionnaireAnswers({});
      setQuestionIndex(0);
      setShowModal(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // STEP 2 → STEP 3: Submit questionnaire + photo + GPS → Show results
  // ═══════════════════════════════════════════════════════════════
  const submitQuestionnaire = async () => {
    setShowModal(false);
    setIsAnalyzing(true);

    // Convert answers to boolean map for backend
    // Backend expects: is_clean=true, is_dry=false, etc.
    const booleanAnswers = {};
    for (const [field, answer] of Object.entries(questionnaireAnswers)) {
      // "Yes" → true, "No" → false, keep as-is for other values
      if (answer === "Yes" || answer === "true") booleanAnswers[field] = true;
      else if (answer === "No" || answer === "false") booleanAnswers[field] = false;
      else booleanAnswers[field] = answer; // e.g. "Hard", "Flexible"
    }

    try {
      const result = await submitScan({
        photoFile: capturedFile,
        latitude: gpsCoords?.latitude || 0,
        longitude: gpsCoords?.longitude || 0,
        locationName: locationName,
        answers: booleanAnswers,
      });
      setScanResult(result);
    } catch (err) {
      console.error("Scan submission failed:", err);
      setScanResult({ error: err.response?.data?.error || "Scan gagal. Coba lagi." });
    } finally {
      setIsAnalyzing(false);
      setScanStep(2);
    }
  };

  const handleResetScan = () => {
    setScanStep(1);
    setIsAnalyzing(false);
    setCapturedImg(null);
    setCapturedFile(null);
    setScanResult(null);
    setCurrentCategory(null);
    setQuestionnaireQuestions([]);
    setQuestionnaireAnswers({});
    // Re-start camera
    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraActive(true);
      } catch { setCameraError("Izin kamera ditolak"); }
    };
    init();
  };

  const handleFlipCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {}
    };
    init();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <NavbarDashboard />

      <QuestionnaireModal
        showModal={showModal}
        currentCategory={currentCategory}
        questions={questionnaireQuestions}
        questionIndex={questionIndex}
        setQuestionIndex={setQuestionIndex}
        questionnaireAnswers={questionnaireAnswers}
        setQuestionnaireAnswers={setQuestionnaireAnswers}
        onSubmit={submitQuestionnaire}
      />

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 pb-28 lg:p-6 lg:pb-6 items-start">

        {/* LEFT: CAMERA VIEWFINDER */}
        <div className="lg:col-span-8 flex flex-col h-full">
          <ScannerViewfinder
            videoRef={videoRef}
            cameraActive={cameraActive}
            scanStep={scanStep}
            isAnalyzing={isAnalyzing}
            cameraError={cameraError}
            capturedImg={capturedImg}
            scanResult={scanResult}
          />

          <ControlBar
            fileInputRef={fileInputRef}
            onFileChange={handleStartAnalysis}
            onUploadClick={triggerFileUpload}
            onShutter={handleStartAnalysis}
            onFlip={handleFlipCamera}
            isAnalyzing={isAnalyzing}
            cameraError={cameraError}
          />
        </div>

        {/* RIGHT: RESULT CONSOLE */}
        <div id="result-section" className="lg:col-span-4 flex flex-col gap-6 h-full">
          <ResultConsole
            scanStep={scanStep}
            isAnalyzing={isAnalyzing}
            scanResult={scanResult}
            gpsCoords={gpsCoords}
            gpsError={gpsError}
            onStepChange={setScanStep}
            onReset={handleResetScan}
          />
          <PieChartCard />
        </div>

        {/* BOTTOM: LEADERBOARD */}
        <div className="col-span-full">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-base font-black text-slate-700 flex items-center gap-2.5">
                Leaderboard
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-0">
              <LeaderboardSection title="User Teraktif" data={leaderboardUsers} type="user" className="pr-3 lg:pr-6 border-r border-slate-200" />
              <LeaderboardSection title="Pantai Terbersih" data={leaderboardBeaches} type="beach" className="pl-3 lg:pl-6" />
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;

import React, { useState, useRef, useEffect } from "react";
import NavbarDashboard from "../components/NavbarDashboard";
import ScannerViewfinder from "../components/dashboard/ScannerViewfinder";
import ControlBar from "../components/dashboard/ControlBar";
import ResultConsole from "../components/dashboard/ResultConsole";
import PieChartCard from "../components/dashboard/PieChartCard";
import LeaderboardSection from "../components/dashboard/LeaderboardSection";
import QuestionnaireModal from "../components/dashboard/QuestionnaireModal";
<<<<<<< HEAD
import { FOCUS_W, FOCUS_H, MATERIAL_RULES, leaderboardUsers, leaderboardBeaches } from "../constants/dashboardData";
=======
import { FOCUS_W, FOCUS_H, leaderboardUsers, leaderboardBeaches } from "../constants/dashboardData";
import { classifyImage, getQuestionnaire, submitScan } from "../services/scanService";
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)

const Dashboard = () => {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [scanStep, setScanStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [capturedImg, setCapturedImg] = useState(null);
<<<<<<< HEAD

  // ── Kuesioner Modal State ──
  const [showModal, setShowModal] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);

=======
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

>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
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

<<<<<<< HEAD
  // ═══════════════════════════════════════════════════════════════
  // STEP 1 → STEP 2: Capture ROI → Kirim ke backend → Buka Modal
  // ═══════════════════════════════════════════════════════════════
  const handleStartAnalysis = async () => {
    if (isAnalyzing) return;

    // 1. ROI CROPPING — Ambil frame dari video, crop sesuai focus box
    let croppedBase64 = null;
    if (videoRef.current && streamRef.current) {
      const video = videoRef.current;
      const fullW = video.videoWidth;
      const fullH = video.videoHeight;

      if (fullW && fullH) {
        const cropX = Math.round(((100 - FOCUS_W) / 2 / 100) * fullW);
        const cropY = Math.round(((100 - FOCUS_H) / 2 / 100) * fullH);
        const cropW = Math.round((FOCUS_W / 100) * fullW);
        const cropH = Math.round((FOCUS_H / 100) * fullH);

        const canvas = document.createElement("canvas");
        canvas.width = cropW;
        canvas.height = cropH;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
        croppedBase64 = canvas.toDataURL("image/jpeg", 0.92);
        setCapturedImg(croppedBase64);
      }
    }

    // 2. Matikan kamera
=======
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
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);

<<<<<<< HEAD
    // 3. Kirim gambar ke backend untuk klasifikasi awal
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: croppedBase64 }),
      });
      const data = await res.json();

      // 4. Set material dari response, buka modal kuesioner
      const material = (data.material || "PLASTIC").toUpperCase();
      setCurrentMaterial(material);
      setQuestionnaireAnswers({});
      setQuestionIndex(0);
      setShowModal(true);
    } catch {
      // Fallback: buka modal dengan PLASTIC jika API gagal
      setCurrentMaterial("PLASTIC");
      setQuestionnaireAnswers({});
      setQuestionIndex(0);
      setShowModal(true);
=======
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
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
    }
  };

  // ═══════════════════════════════════════════════════════════════
<<<<<<< HEAD
  // STEP 3 → STEP 4: Submit kuesioner → Render hasil analisis
  // ═══════════════════════════════════════════════════════════════
  const submitQuestionnaire = async () => {
    const activeKeys = MATERIAL_RULES[currentMaterial] || [];
    const allAnswered = activeKeys.every((k) => questionnaireAnswers[k]);
    if (!allAnswered) return;

    setShowModal(false);
    setIsAnalyzing(true);

    try {
      const res = await fetch("/api/scan/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: capturedImg,
          material: currentMaterial,
          answers: questionnaireAnswers,
        }),
      });
      const data = await res.json();
      // TODO: setResults(data) ketika backend sudah siap
      console.log("Analysis result:", data);
    } catch {
      // Lanjut ke step 2 meski API gagal (demo mode)
    }

    setIsAnalyzing(false);
    setScanStep(2);
=======
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
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
  };

  const handleResetScan = () => {
    setScanStep(1);
    setIsAnalyzing(false);
    setCapturedImg(null);
<<<<<<< HEAD
=======
    setCapturedFile(null);
    setScanResult(null);
    setCurrentCategory(null);
    setQuestionnaireQuestions([]);
    setQuestionnaireAnswers({});
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
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
<<<<<<< HEAD
        currentMaterial={currentMaterial}
=======
        currentCategory={currentCategory}
        questions={questionnaireQuestions}
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
        questionIndex={questionIndex}
        setQuestionIndex={setQuestionIndex}
        questionnaireAnswers={questionnaireAnswers}
        setQuestionnaireAnswers={setQuestionnaireAnswers}
        onSubmit={submitQuestionnaire}
      />

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 pb-28 lg:p-6 lg:pb-6 items-start">

<<<<<<< HEAD
        {/* ═══════════════════════════════════════════
            LEFT: DJI-STYLE CAMERA VIEWFINDER
            ═══════════════════════════════════════════ */}
=======
        {/* LEFT: CAMERA VIEWFINDER */}
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
        <div className="lg:col-span-8 flex flex-col h-full">
          <ScannerViewfinder
            videoRef={videoRef}
            cameraActive={cameraActive}
            scanStep={scanStep}
            isAnalyzing={isAnalyzing}
            cameraError={cameraError}
            capturedImg={capturedImg}
<<<<<<< HEAD
=======
            scanResult={scanResult}
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
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

<<<<<<< HEAD
        {/* ═══════════════════════════════════════════
            RIGHT: RESULT CONSOLE
            ═══════════════════════════════════════════ */}
=======
        {/* RIGHT: RESULT CONSOLE */}
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
        <div id="result-section" className="lg:col-span-4 flex flex-col gap-6 h-full">
          <ResultConsole
            scanStep={scanStep}
            isAnalyzing={isAnalyzing}
<<<<<<< HEAD
=======
            scanResult={scanResult}
            gpsCoords={gpsCoords}
            gpsError={gpsError}
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
            onStepChange={setScanStep}
            onReset={handleResetScan}
          />
          <PieChartCard />
        </div>

<<<<<<< HEAD
        {/* ═══════════════════════════════════════════
            BOTTOM: LEADERBOARD (FULL WIDTH)
            ═══════════════════════════════════════════ */}
=======
        {/* BOTTOM: LEADERBOARD */}
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
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

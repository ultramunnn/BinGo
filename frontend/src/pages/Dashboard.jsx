import React, { useState, useRef, useEffect } from "react";
import NavbarDashboard from "../components/NavbarDashboard";
import ScannerViewfinder from "../components/dashboard/ScannerViewfinder";
import ControlBar from "../components/dashboard/ControlBar";
import ResultConsole from "../components/dashboard/ResultConsole";
import PieChartCard from "../components/dashboard/PieChartCard";
import ChartDetailModal from "../components/dashboard/ChartDetailModal";
import LeaderboardSection from "../components/dashboard/LeaderboardSection";
import QuestionnaireModal from "../components/dashboard/QuestionnaireModal";
import { FOCUS_W, FOCUS_H } from "../constants/dashboardData";
import { classifyImage, getQuestionnaire, submitScan, getLeaderboard } from "../services/scanService";
import { getBeachesForMap } from "../services/beachService";
import { getStoredUser } from "../services/authService";

const Dashboard = () => {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const user = getStoredUser();

  const [scanStep, setScanStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [capturedImg, setCapturedImg] = useState(null);
  const [capturedFile, setCapturedFile] = useState(null);

  const [gpsCoords, setGpsCoords] = useState(null);
  const [gpsError, setGpsError] = useState(null);
  const [locationName, setLocationName] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [questionnaireQuestions, setQuestionnaireQuestions] = useState([]);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);

  const [scanResult, setScanResult] = useState(null);
  const [chartDetailOpen, setChartDetailOpen] = useState(false);

  const [showCategoryConfirm, setShowCategoryConfirm] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");

  const [nearbyBeach, setNearbyBeach] = useState(null);
  const [beachCheckDone, setBeachCheckDone] = useState(false);

  const [leaderboardUsers, setLeaderboardUsers] = useState([]);
  const [leaderboardBeaches, setLeaderboardBeaches] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState(null);

  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

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

        const geocodePromise = fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json&accept-language=id`
        )
          .then((res) => res.json())
          .then((data) => { if (data.display_name) setLocationName(data.display_name); })
          .catch(() => {});

        const beachTimeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 1000)
        );
        const beachPromise = Promise.race([getBeachesForMap(), beachTimeout])
          .then((beaches) => {
            let closest = null;
            let minDist = Infinity;
            for (const beach of beaches) {
              const dist = haversine(coords.latitude, coords.longitude, beach.latitude, beach.longitude);
              if (dist <= 1 && dist < minDist) {
                closest = { ...beach, distance: dist };
                minDist = dist;
              }
            }
            setNearbyBeach(closest);
          })
          .catch((err) => console.warn("Beach detection failed:", err))
          .finally(() => setBeachCheckDone(true));

        await Promise.all([geocodePromise, beachPromise]);
      },
      (err) => {
        setGpsError("Izin lokasi ditolak: " + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    getLeaderboard()
      .then((data) => {
        const users = (data.users || []).map((u, i) => ({
          rank: i + 1,
          name: u.name || "User",
          img: u.photo_url || null,
          score: `${u.score ?? 0} scan`,
        }));
        const beaches = (data.beaches || []).map((b, i) => ({
          rank: i + 1,
          name: b.name || "Pantai",
          img: b.image_url || null,
          score: `${b.score ?? 0}/5`,
        }));
        setLeaderboardUsers(users);
        setLeaderboardBeaches(beaches);
        if (data.currentUser) {
          setCurrentUserRank(data.currentUser);
        }
      })
      .catch((err) => console.warn("Leaderboard fetch failed:", err))
      .finally(() => setLeaderboardLoading(false));
  }, []);

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
        if (videoRef.current) {
          // Desktop webcam = mirror. Mobile back camera = no mirror.
          const isDesktop = window.innerWidth >= 1024;
          videoRef.current.style.transform = isDesktop ? "scaleX(-1)" : "scaleX(1)";
          videoRef.current.srcObject = stream;
        }
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

  const handleStartAnalysis = async (e) => {
    if (isAnalyzing) return;

    let photoFile = null;

    if (e?.target?.files?.[0]) {
      photoFile = e.target.files[0];
      setCapturedImg(URL.createObjectURL(photoFile));
    } else {
      photoFile = await captureFrameAsFile();
      if (photoFile) {
        setCapturedImg(URL.createObjectURL(photoFile));
      }
    }

    if (!photoFile) return;

    setCapturedFile(photoFile);

    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);

    setIsAnalyzing(true);
    try {
      const cvResult = await classifyImage(photoFile);
      const category = cvResult.predicted_class; 
      const categoryUpper = category.toUpperCase();

      setCurrentCategory(categoryUpper);
      setScanStep(2);
      setShowCategoryConfirm(true);
    } catch (err) {
      console.error("Classification failed:", err);
      if (err.message?.includes("maksimal 600KB")) {
        alert(err.message);
        handleResetScan();
        return;
      }
      setCurrentCategory("UNKNOWN");
      setScanStep(2);
      setShowCategoryConfirm(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCategoryConfirm = async () => {
    setShowCategoryConfirm(false);
    setIsAnalyzing(true);

    try {
      const questionnaireData = await getQuestionnaire(currentCategory.toLowerCase());
      setQuestionnaireQuestions(questionnaireData.questions || []);
    } catch {
      setQuestionnaireQuestions([]);
    }

    setQuestionnaireAnswers({});
    setQuestionIndex(0);
    setShowModal(true);
    setIsAnalyzing(false);
  };

  const handleCategoryReject = () => {
    handleResetScan();
  };

  const submitQuestionnaire = async () => {
    setShowModal(false);
    setIsAnalyzing(true);

    const booleanAnswers = {};
    for (const [field, answer] of Object.entries(questionnaireAnswers)) {
      if (answer === "Yes" || answer === "true") booleanAnswers[field] = true;
      else if (answer === "No" || answer === "false") booleanAnswers[field] = false;
      else booleanAnswers[field] = answer; 
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
    setShowCategoryConfirm(false);
    setQuestionnaireQuestions([]);
    setQuestionnaireAnswers({});
    setFacingMode("environment");
    if (fileInputRef.current) fileInputRef.current.value = "";
    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          const isDesktop = window.innerWidth >= 1024;
          videoRef.current.style.transform = isDesktop ? "scaleX(-1)" : "scaleX(1)";
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
      } catch { setCameraError("Izin kamera ditolak"); }
    };
    init();
  };

  const handleFlipCamera = () => {
    const newMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(newMode);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: newMode, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.style.transform = newMode === "user" ? "scaleX(-1)" : "scaleX(1)";
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera flip failed:", err);
        setFacingMode(facingMode);
      }
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

      <ChartDetailModal
        open={chartDetailOpen}
        onClose={() => setChartDetailOpen(false)}
        scanResult={scanResult}
      />

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 pb-28 lg:p-6 lg:pb-6 items-start">

        <div className="lg:col-span-8 flex flex-col h-full">
          <ScannerViewfinder
            videoRef={videoRef}
            cameraActive={cameraActive}
            scanStep={scanStep}
            isAnalyzing={isAnalyzing}
            cameraError={cameraError}
            capturedImg={capturedImg}
            scanResult={scanResult}
            showCategoryConfirm={showCategoryConfirm}
            currentCategory={currentCategory}
            onCategoryConfirm={handleCategoryConfirm}
            onCategoryReject={handleCategoryReject}
            nearbyBeach={nearbyBeach}
            beachCheckDone={beachCheckDone}
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
          <PieChartCard
            scanResult={scanResult}
            onDetailClick={() => setChartDetailOpen(true)}
          />
        </div>

        <div className="col-span-full">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-base font-black text-slate-700 flex items-center gap-2.5">
                Leaderboard
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-0">
              <LeaderboardSection title="User Teraktif" data={leaderboardUsers} type="user" loading={leaderboardLoading} currentUser={currentUserRank} userName={user?.full_name} className="pr-3 lg:pr-6 border-r border-slate-200" />
              <LeaderboardSection title="Pantai Terbersih" data={leaderboardBeaches} type="beach" loading={leaderboardLoading} className="pl-3 lg:pl-6" />
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;

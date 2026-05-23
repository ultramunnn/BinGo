import React, { useState, useRef, useEffect } from "react";
import NavbarDashboard from "../components/NavbarDashboard";
import ScannerViewfinder from "../components/dashboard/ScannerViewfinder";
import ControlBar from "../components/dashboard/ControlBar";
import ResultConsole from "../components/dashboard/ResultConsole";
import PieChartCard from "../components/dashboard/PieChartCard";
import LeaderboardSection from "../components/dashboard/LeaderboardSection";
import QuestionnaireModal from "../components/dashboard/QuestionnaireModal";
import { FOCUS_W, FOCUS_H, MATERIAL_RULES, leaderboardUsers, leaderboardBeaches } from "../constants/dashboardData";

const Dashboard = () => {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [scanStep, setScanStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [capturedImg, setCapturedImg] = useState(null);

  // ── Kuesioner Modal State ──
  const [showModal, setShowModal] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);

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
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);

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
    }
  };

  // ═══════════════════════════════════════════════════════════════
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
  };

  const handleResetScan = () => {
    setScanStep(1);
    setIsAnalyzing(false);
    setCapturedImg(null);
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
        currentMaterial={currentMaterial}
        questionIndex={questionIndex}
        setQuestionIndex={setQuestionIndex}
        questionnaireAnswers={questionnaireAnswers}
        setQuestionnaireAnswers={setQuestionnaireAnswers}
        onSubmit={submitQuestionnaire}
      />

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 pb-28 lg:p-6 lg:pb-6 items-start">

        {/* ═══════════════════════════════════════════
            LEFT: DJI-STYLE CAMERA VIEWFINDER
            ═══════════════════════════════════════════ */}
        <div className="lg:col-span-8 flex flex-col h-full">
          <ScannerViewfinder
            videoRef={videoRef}
            cameraActive={cameraActive}
            scanStep={scanStep}
            isAnalyzing={isAnalyzing}
            cameraError={cameraError}
            capturedImg={capturedImg}
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

        {/* ═══════════════════════════════════════════
            RIGHT: RESULT CONSOLE
            ═══════════════════════════════════════════ */}
        <div id="result-section" className="lg:col-span-4 flex flex-col gap-6 h-full">
          <ResultConsole
            scanStep={scanStep}
            isAnalyzing={isAnalyzing}
            onStepChange={setScanStep}
            onReset={handleResetScan}
          />
          <PieChartCard />
        </div>

        {/* ═══════════════════════════════════════════
            BOTTOM: LEADERBOARD (FULL WIDTH)
            ═══════════════════════════════════════════ */}
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

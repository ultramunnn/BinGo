import React, { useState, useRef, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import NavbarDashboard from "../components/NavbarDashboard";

// ── Icons ──
const IconUpload = ({ className = "w-4 h-4" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);

const IconRefresh = ({ className = "w-4 h-4" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
);

const IconFlip = ({ className = "w-4 h-4" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/><path d="M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5"/><path d="m16 3-4 4 4 4"/><path d="m8 21 4-4-4-4"/></svg>
);

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [scanStep, setScanStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Focus box dimensions (percentage of viewport)
  const FOCUS_W = 72; // width %
  const FOCUS_H = 78; // height %

  // Leaderboard data
  const leaderboardUsers = [
    { name: 'Lilyonetw...', score: '146 Scan', img: 'https://i.pravatar.cc/150?u=lily', rank: 1 },
    { name: 'Josheleve...', score: '105 Scan', img: 'https://i.pravatar.cc/150?u=josh', rank: 2 },
    { name: 'Herotaylo...', score: '99 Scan', img: 'https://i.pravatar.cc/150?u=hero', rank: 3 },
    { name: 'Adityawij...', score: '87 Scan', img: 'https://i.pravatar.cc/150?u=adi', rank: 4 },
    { name: 'Putrihalo...', score: '76 Scan', img: 'https://i.pravatar.cc/150?u=putri', rank: 5 },
    { name: 'Budisant...', score: '71 Scan', img: 'https://i.pravatar.cc/150?u=budi', rank: 6 },
    { name: 'Sarinahlo...', score: '65 Scan', img: 'https://i.pravatar.cc/150?u=sari', rank: 7 },
    { name: 'Fajarudd...', score: '58 Scan', img: 'https://i.pravatar.cc/150?u=fajar', rank: 8 },
    { name: 'Dewilest...', score: '52 Scan', img: 'https://i.pravatar.cc/150?u=dewi', rank: 9 },
    { name: 'Rizkypra...', score: '47 Scan', img: 'https://i.pravatar.cc/150?u=rizky', rank: 10 },
  ];

  const leaderboardBeaches = [
    { name: 'Pantai Kuta', score: '98% Bersih', rank: 1 },
    { name: 'Pantai Pandawa', score: '92% Bersih', rank: 2 },
    { name: 'Pantai Sanur', score: '85% Bersih', rank: 3 },
    { name: 'Pantai Jimbaran', score: '82% Bersih', rank: 4 },
    { name: 'Pantai Nusa Dua', score: '79% Bersih', rank: 5 },
    { name: 'Pantai Seminyak', score: '75% Bersih', rank: 6 },
    { name: 'Pantai Canggu', score: '71% Bersih', rank: 7 },
    { name: 'Pantai Lovina', score: '68% Bersih', rank: 8 },
    { name: 'Pantai Amed', score: '64% Bersih', rank: 9 },
    { name: 'Pantai Padang', score: '60% Bersih', rank: 10 },
  ];

  // Pie chart data — AI classification result
  const pieData = [
    { name: "Plastik", value: 42, color: "#0f172a" },
    { name: "Organik", value: 28, color: "#64748b" },
    { name: "Logam", value: 15, color: "#94a3b8" },
    { name: "Kaca", value: 10, color: "#cbd5e1" },
    { name: "Lainnya", value: 5, color: "#e2e8f0" },
  ];

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

  const handleStartAnalysis = () => {
    if (isAnalyzing) return;
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
    setIsAnalyzing(true);
    setScanStep(1);
    setTimeout(() => { setIsAnalyzing(false); setScanStep(2); }, 2000);
  };

  const handleResetScan = () => {
    setScanStep(1);
    setIsAnalyzing(false);
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
    // Placeholder — flip between front/back
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
      <NavbarDashboard activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 lg:p-6 items-start">

        {/* ═══════════════════════════════════════════
            LEFT: DJI-STYLE CAMERA VIEWFINDER
            ═══════════════════════════════════════════ */}
        <div className="lg:col-span-8 flex flex-col h-full">

          {/* ── Viewfinder Container ── */}
          <div className="bg-black rounded-t-2xl overflow-hidden relative">
            <div className="w-full aspect-[3/4] lg:aspect-video relative overflow-hidden">

              {/* Layer 0: Camera Feed / Captured Image */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  cameraActive && scanStep === 1 ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              />
              {scanStep >= 2 && (
                <img
                  src="https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?q=80&w=1000&auto=format&fit=crop"
                  alt="Captured"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                />
              )}

              {/* ── Layer 1: BLUR MASK (4 panels around focus box) ── */}

              {/* Top Panel */}
              <div
                className="absolute top-0 left-0 right-0 backdrop-blur-md bg-black/40 pointer-events-none z-10"
                style={{ height: `${(100 - FOCUS_H) / 2}%` }}
              ></div>

              {/* Bottom Panel */}
              <div
                className="absolute bottom-0 left-0 right-0 backdrop-blur-md bg-black/40 pointer-events-none z-10"
                style={{ height: `${(100 - FOCUS_H) / 2}%` }}
              ></div>

              {/* Middle: Left + Right panels flanking focus box */}
              <div
                className="absolute left-0 right-0 flex pointer-events-none z-10"
                style={{
                  top: `${(100 - FOCUS_H) / 2}%`,
                  height: `${FOCUS_H}%`,
                }}
              >
                {/* Left Panel */}
                <div
                  className="h-full backdrop-blur-md bg-black/40"
                  style={{ width: `${(100 - FOCUS_W) / 2}%` }}
                ></div>

                {/* Center: Focus Box (transparent hole) */}
                <div className="h-full" style={{ width: `${FOCUS_W}%` }}></div>

                {/* Right Panel */}
                <div
                  className="h-full backdrop-blur-md bg-black/40"
                  style={{ width: `${(100 - FOCUS_W) / 2}%` }}
                ></div>
              </div>

              {/* ── Layer 2: FOCUS BOX ── */}
              <div
                className="absolute border border-white/10 rounded-xl pointer-events-none z-20"
                style={{
                  top: `${(100 - FOCUS_H) / 2}%`,
                  left: `${(100 - FOCUS_W) / 2}%`,
                  width: `${FOCUS_W}%`,
                  height: `${FOCUS_H}%`,
                }}
              >
                {/* Bracket Corners (putih) */}
                <div className="absolute -top-px -left-px w-10 h-10 border-t-[3px] border-l-[3px] border-white rounded-tl-xl"></div>
                <div className="absolute -top-px -right-px w-10 h-10 border-t-[3px] border-r-[3px] border-white rounded-tr-xl"></div>
                <div className="absolute -bottom-px -left-px w-10 h-10 border-b-[3px] border-l-[3px] border-white rounded-bl-xl"></div>
                <div className="absolute -bottom-px -right-px w-10 h-10 border-b-[3px] border-r-[3px] border-white rounded-br-xl"></div>

                {/* Vertical lines di tengah kiri & kanan (antara bracket) */}
                <div className="absolute top-1/2 -translate-y-1/2 -left-px w-0.5 h-14 bg-white"></div>
                <div className="absolute top-1/2 -translate-y-1/2 -right-px w-0.5 h-14 bg-white"></div>

                {/* Scanning Laser Line */}
                {scanStep === 1 && (
                  <div className="absolute inset-x-0 overflow-hidden pointer-events-none">
                    <div className="h-0.5 bg-linear-to-r from-transparent via-white to-transparent shadow-[0_0_8px_rgba(255,255,255,0.4)] animate-scan"></div>
                  </div>
                )}
              </div>

              {/* Standby text (camera loading / error) */}
              {scanStep === 1 && !isAnalyzing && !cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
                  {cameraError ? (
                    <>
                      <p className="text-red-400 text-xs font-mono">{cameraError}</p>
                      <p className="text-slate-500 text-[10px] mt-1">Gunakan Unggah File sebagai alternatif</p>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <p className="text-white/50 text-[10px] font-mono tracking-widest">INITIALIZING CAMERA...</p>
                    </div>
                  )}
                </div>
              )}

              {/* Analyzing overlay */}
              {isAnalyzing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
                  <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-2"></div>
                  <p className="text-white text-[10px] font-mono tracking-[0.2em] animate-pulse">ANALYZING...</p>
                </div>
              )}

              {/* ── Step 2: Callout Lines + Labels ── */}
              {scanStep === 2 && (
                <div className="absolute inset-0 z-40 pointer-events-none">

                  {/* 1. OBJ (Left Side) */}
                  <div className="absolute left-[5%] lg:left-[10%] top-[45%] flex items-center z-50 pointer-events-none">
                    <div className="bg-white/90 backdrop-blur-sm px-1.5 py-0.5 lg:px-2 lg:py-1 rounded mr-1 lg:mr-2">
                      <span className="text-[6px] lg:text-[8px] font-bold text-black/40 uppercase tracking-widest leading-none block">Obj</span>
                      <span className="text-[10px] lg:text-xs font-extrabold text-black leading-tight">Plastic Bottle</span>
                    </div>
                    <svg width="80" height="40" viewBox="0 0 450 100" fill="none" className="overflow-visible lg:w-[220px] lg:h-[80px]">
                      <path d="M0 10 H380 L420 70" stroke="black" strokeWidth="5" strokeLinecap="round" />
                      <circle cx="0" cy="10" r="5" fill="black" />
                      <circle cx="420" cy="70" r="10" fill="black" fillOpacity="0.15" />
                      <circle cx="420" cy="70" r="5" fill="black" />
                    </svg>
                  </div>

                  {/* 2. CONF (Right Top) */}
                  <div className="absolute right-[8%] lg:right-[16%] top-[35%] flex items-center z-50 pointer-events-none">
                    <svg width="80" height="40" viewBox="0 0 450 100" fill="none" className="overflow-visible lg:w-[220px] lg:h-[80px]">
                      <path d="M30 70 L70 10 H450" stroke="black" strokeWidth="5" strokeLinecap="round" />
                      <circle cx="30" cy="70" r="10" fill="black" fillOpacity="0.15" />
                      <circle cx="30" cy="70" r="5" fill="black" />
                      <circle cx="450" cy="10" r="5" fill="black" />
                    </svg>
                    <div className="bg-white/90 backdrop-blur-sm px-1.5 py-0.5 lg:px-2 lg:py-1 rounded ml-1 lg:ml-2">
                      <span className="text-[6px] lg:text-[8px] font-bold text-black/40 uppercase tracking-widest leading-none block">Conf</span>
                      <span className="text-[10px] lg:text-xs font-extrabold text-black leading-tight">98.2%</span>
                    </div>
                  </div>

                  {/* 3. REC (Right Bottom) */}
                  <div className="absolute right-[8%] lg:right-[15%] bottom-[30%] flex items-center z-50 pointer-events-none">
                    <svg width="80" height="40" viewBox="0 0 450 100" fill="none" className="overflow-visible lg:w-[220px] lg:h-[80px]">
                      <path d="M30 70 L70 10 H450" stroke="black" strokeWidth="5" strokeLinecap="round" />
                      <circle cx="30" cy="70" r="10" fill="black" fillOpacity="0.15" />
                      <circle cx="30" cy="70" r="5" fill="black" />
                      <circle cx="450" cy="10" r="5" fill="black" />
                    </svg>
                    <div className="bg-white/90 backdrop-blur-sm px-1.5 py-0.5 lg:px-2 lg:py-1 rounded ml-1 lg:ml-2">
                      <span className="text-[6px] lg:text-[8px] font-bold text-black/40 uppercase tracking-widest leading-none block">Recyc</span>
                      <span className="text-[10px] lg:text-xs font-extrabold text-black leading-tight">YES</span>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Bouncing scroll arrow — mobile only, after scan */}
            {scanStep >= 2 && (
              <button
                onClick={() => document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 lg:hidden cursor-pointer"
              >
                <svg className="w-6 h-6 text-white/70 animate-bounce" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
            )}
          </div>

          {/* ── Control Bar ── */}
          <div className="bg-slate-900 rounded-b-2xl px-5 py-4 flex items-center justify-between">
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleStartAnalysis} />

            {/* Left: Upload */}
            <button
              onClick={triggerFileUpload}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-400 hover:text-white rounded-xl text-xs font-mono border border-white/10 transition-all active:scale-95"
            >
              <IconUpload className="w-4 h-4" />
              <span className="hidden sm:inline">UPLOAD</span>
            </button>

            {/* Center: Shutter */}
            <div className="relative group">
              <button
                onClick={handleStartAnalysis}
                disabled={isAnalyzing || !!cameraError}
                className="w-14 h-14 bg-white hover:bg-slate-200 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-full flex items-center justify-center ring-[3px] ring-white/20 hover:ring-white/40 disabled:ring-white/10 transition-all active:scale-90 shadow-lg group"
              >
                <div className={`w-11 h-11 rounded-full border-2 transition-all ${isAnalyzing ? "bg-slate-600 border-slate-500 scale-75" : cameraError ? "border-slate-600" : "border-slate-900/10 group-hover:scale-95"}`}></div>
              </button>
              {cameraError && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap bg-slate-800 text-white text-[9px] font-mono px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                  Kamera mati &mdash; gunakan Upload
                </div>
              )}
            </div>

            {/* Right: Flip / Metadata */}
            <button
              onClick={handleFlipCamera}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-400 hover:text-white rounded-xl text-xs font-mono border border-white/10 transition-all active:scale-95"
            >
              <IconFlip className="w-4 h-4" />
              <span className="hidden sm:inline">FLIP</span>
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            RIGHT: RESULT CONSOLE
            ═══════════════════════════════════════════ */}
        <div id="result-section" className="lg:col-span-4 flex flex-col gap-6 h-full">

          {/* Result Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold tracking-tight text-slate-400 uppercase font-mono">Result Console</h2>
              <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded font-bold">
                STEP {scanStep}/4
              </span>
            </div>

            {scanStep === 1 && !isAnalyzing && (
              <div className="flex flex-col items-center justify-center flex-1 gap-4 py-6">
                  <svg className="w-10 h-10 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                    <circle cx="12" cy="12" r="3" /><path d="M12 9v-1" /><path d="M12 16v1" /><path d="M9 12H8" /><path d="M16 12h1" />
                  </svg>
                <div className="text-center">
                  <p className="text-xs text-slate-500 font-medium">Tekan shutter untuk mulai scan</p>
                </div>
              </div>
            )}

            {scanStep === 1 && isAnalyzing && (
              <div className="flex flex-col items-center justify-center flex-1 gap-4 py-6">
                <div className="w-16 h-16 rounded-2xl bg-cyan-50 border border-cyan-200/60 flex items-center justify-center">
                  <div className="w-7 h-7 border-2 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest mb-1">Executing Tensor</p>
                  <p className="text-xs text-slate-600 font-medium animate-pulse">Mengklasifikasikan objek...</p>
                </div>
              </div>
            )}

            {scanStep === 2 && (
              <div className="flex flex-col gap-4 flex-1">
                <div className="bg-cyan-50 border border-cyan-200/60 p-4 rounded-xl font-mono">
                  <p className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest mb-1">Status Analisis Vision</p>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Model mengenali <span className="font-bold text-slate-900">Plastic Bottle</span> dengan tingkat keyakinan <span className="text-emerald-600 font-bold">98.2%</span>.
                  </p>
                </div>
                <button
                  onClick={() => setScanStep(3)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl text-xs font-mono transition-all"
                >
                  EXTRACT SUMMARY (STEP 3) &rarr;
                </button>
              </div>
            )}

            {scanStep === 3 && (
              <div className="flex flex-col gap-4 flex-1">
                <div className="grid grid-cols-2 gap-2 font-mono text-center">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                    <span className="text-[9px] text-slate-400 block font-bold">MATERIAL</span>
                    <span className="text-xs font-extrabold text-slate-800">PET Plastic</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col items-center justify-center">
                    <span className="text-[9px] text-slate-400 block font-bold mb-0.5">RECYCLABLE</span>
                    <span className="text-xs text-emerald-600 font-bold">&#10003; YES</span>
                  </div>
                </div>
                <div className="bg-cyan-50 border border-cyan-100 p-3.5 rounded-xl text-[11px] text-slate-700 leading-relaxed">
                  <span className="font-bold text-cyan-800 block mb-0.5">AI RECOMMENDATION:</span>
                  Botol PET ini bernilai tinggi. Bilas bersih, lepaskan label kemasan, dan remas untuk menghemat ruang.
                </div>
                <button
                  onClick={() => setScanStep(4)}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2.5 rounded-xl text-xs font-mono transition-all"
                >
                  VALIDATE GEOLOCATION (STEP 4) &rarr;
                </button>
              </div>
            )}

            {scanStep === 4 && (
              <div className="flex flex-col gap-4 flex-1">
                <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-[11px] flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] text-cyan-400 uppercase tracking-widest block font-bold">LOCATION DETECTED</span>
                      <span className="text-xs font-bold text-white">Pantai Teluk Asmara</span>
                    </div>
                    <span className="text-amber-400 font-bold">&#9733; 4.8</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1 pt-2 border-t border-slate-800 text-[10px]">
                    <div>
                      <span className="text-slate-400 block">SCANNED</span>
                      <span className="text-white font-bold">1,240 Pcs</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">CLEANLINESS</span>
                      <span className="text-emerald-400 font-bold">Good Condition</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleResetScan}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-xs font-mono transition-all"
                >
                  <IconRefresh className="w-3.5 h-3.5" />
                  RESET &amp; SCAN BARU
                </button>
              </div>
            )}
          </div>

          {/* AI Classification Pie Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold tracking-tight text-slate-400 uppercase font-mono">Klasifikasi Sampah</h2>
              <span className="text-[10px] font-mono text-slate-400">AI Result</span>
            </div>

            <div className="flex-1 min-h-[200px] lg:min-h-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="85%"
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#0f172a",
                      border: "none",
                      borderRadius: 12,
                      padding: "8px 12px",
                      fontFamily: "monospace",
                      fontSize: 11,
                    }}
                    itemStyle={{ color: "#fff", fontWeight: 700 }}
                    formatter={(value) => [`${value}%`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-slate-100">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
                  <span className="text-[10px] font-mono text-slate-500">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            BOTTOM: LEADERBOARD (FULL WIDTH)
            ═══════════════════════════════════════════ */}
        <div className="col-span-full">
          <div
            className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col flex-1"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-base font-black text-slate-700 flex items-center gap-2.5">
                Leaderboard
              </h2>
            </div>

            {/* Two columns inside one card */}
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

// ── Leaderboard Section ──
const LeaderboardSection = ({ title, data, type, className = '' }) => {
  const podiumData = [data[1], data[0], data[2]];
  const listData = data.slice(3);
  const isBeach = type === 'beach';

  return (
    <div className={className}>
      <h3 className="text-[10px] lg:text-sm font-bold text-slate-600 mb-2 lg:mb-5 truncate">
        {title}
      </h3>

      {/* Podium */}
      <div className="flex items-end justify-center gap-0.5 lg:gap-2 pb-2 lg:pb-4">
        {podiumData.map((item) => (
          <PodiumPillar key={item.rank} item={item} type={type} />
        ))}
      </div>

      {/* List 4-10 */}
      <div className="mt-2 lg:mt-4 flex flex-col">
        {listData.map((item) => (
          <div key={item.rank} className="flex items-center gap-1.5 lg:gap-3 px-1.5 lg:px-3 py-0.5 lg:py-1.5">
            <span className="text-[8px] lg:text-[10px] font-mono font-bold text-slate-400 w-3 lg:w-4 text-center shrink-0">{item.rank}</span>
            <div className="w-4 h-4 lg:w-6 lg:h-6 shrink-0">
              {!isBeach && <AvatarWithFallback src={item.img} alt={item.name} size="w-4 h-4 lg:w-6 lg:h-6" />}
            </div>
            <p className="flex-1 text-[8px] lg:text-[11px] text-slate-600 truncate">{item.name}</p>
            <span className="text-[7px] lg:text-[9px] font-mono font-bold text-slate-400 shrink-0">{item.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Podium Pillar ──
const PodiumPillar = ({ item, type }) => {
  const isRank1 = item.rank === 1;
  const isBeach = type === 'beach';
  const heights = { 1: 'h-16 lg:h-36', 2: 'h-14 lg:h-28', 3: 'h-12 lg:h-20' };
  const pillarHeight = heights[item.rank];

  return (
    <div className="flex flex-col items-center flex-1 max-w-16 lg:max-w-32">
      <div className={`flex flex-col items-center mb-1.5 lg:mb-3 ${isRank1 ? 'h-16 lg:h-28' : 'h-14 lg:h-24'}`}>
        {!isBeach && (
          <div className={`relative ${isRank1 ? 'scale-100 lg:scale-110' : ''}`}>
            <AvatarWithFallback src={item.img} alt={item.name} size={isRank1 ? 'w-8 h-8 lg:w-14 lg:h-14' : 'w-7 h-7 lg:w-12 lg:h-12'} />
            <div className="absolute -top-1 -right-1 lg:-top-1.5 lg:-right-1.5 w-6 h-6 lg:w-8 lg:h-8">
              {/* Mini sunflower petals */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 32 32">
                {Array.from({ length: 8 }).map((_, i) => {
                  const angle = i * 45;
                  const colors = {
                    1: { fill: '#fbbf24', stroke: '#f59e0b' },
                    2: { fill: '#94a3b8', stroke: '#64748b' },
                    3: { fill: '#fb923c', stroke: '#f97316' },
                  };
                  const c = colors[item.rank];
                  return (
                    <ellipse
                      key={i}
                      cx="16"
                      cy="6"
                      rx="3.5"
                      ry="6"
                      fill={c.fill}
                      fillOpacity="0.3"
                      stroke={c.stroke}
                      strokeWidth="0.5"
                      strokeOpacity="0.4"
                      transform={`rotate(${angle} 16 16)`}
                    />
                  );
                })}
              </svg>
              {/* Center badge */}
              <div className={`absolute inset-0 m-auto w-3.5 h-3.5 lg:w-5 lg:h-5 rounded-full flex items-center justify-center text-[7px] lg:text-[9px] font-black text-white shadow-md z-10
                ${item.rank === 1 ? 'bg-amber-500' : item.rank === 2 ? 'bg-slate-500' : 'bg-orange-500'}`}>
                {item.rank}
              </div>
            </div>
          </div>
        )}
        {isBeach && (
          <div className="relative w-10 h-10 lg:w-18 lg:h-18 flex items-center justify-center">
            {/* Sunflower petals */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 80">
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = i * 30;
                const colors = {
                  1: { fill: '#fbbf24', stroke: '#f59e0b' },
                  2: { fill: '#94a3b8', stroke: '#64748b' },
                  3: { fill: '#fb923c', stroke: '#f97316' },
                };
                const c = colors[item.rank];
                return (
                  <ellipse
                    key={i}
                    cx="40"
                    cy="16"
                    rx="7"
                    ry="14"
                    fill={c.fill}
                    fillOpacity="0.25"
                    stroke={c.stroke}
                    strokeWidth="0.8"
                    strokeOpacity="0.4"
                    transform={`rotate(${angle} 40 40)`}
                  />
                );
              })}
            </svg>
            {/* Center circle */}
            <div className={`relative z-10 w-8 h-8 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-[8px] lg:text-sm font-black text-white shadow-md
              ${item.rank === 1 ? 'bg-amber-500' : item.rank === 2 ? 'bg-slate-500' : 'bg-orange-500'}`}>
              {item.rank}
            </div>
          </div>
        )}
        <div className="flex flex-col items-center mt-auto">
          <p className="text-[7px] lg:text-[10px] font-bold text-slate-700 truncate w-12 lg:w-20 text-center">{item.name}</p>
          <span className="text-[6px] lg:text-[8px] font-mono font-bold text-slate-500">{item.score}</span>
        </div>
      </div>

      {/* Neumorphic Plinth */}
      <div className="relative w-full">
        <div className="absolute inset-0 rounded-md lg:rounded-xl translate-x-0.75 translate-y-0.75" style={{ background: '#d2d2d6', filter: 'blur(6px)', opacity: 0.6 }} />
        <div
          className={`${pillarHeight} w-full rounded-md lg:rounded-xl relative overflow-hidden`}
          style={{
            background: 'linear-gradient(155deg, #f4f4f7 0%, #e6e6ea 40%, #d8d8dc 100%)',
            boxShadow: '8px 8px 18px #bcbcc0, -6px -6px 14px #ffffff, inset 2px 2px 4px rgba(255,255,255,0.85), inset -2px -2px 4px rgba(0,0,0,0.08)',
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-3 lg:h-4 rounded-t-md lg:rounded-t-xl" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.7), transparent)' }} />
          <div className="absolute top-0 left-0 bottom-0 w-1.5 lg:w-2 rounded-l-md lg:rounded-l-xl" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.5), transparent)' }} />
          <div className="absolute top-0 right-0 bottom-0 w-2 lg:w-3 rounded-r-md lg:rounded-r-xl" style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.07), transparent)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-3 lg:h-4 rounded-b-md lg:rounded-b-xl" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.08), transparent)' }} />
          <div className="absolute top-2 left-2 lg:top-3 lg:left-4 w-5 h-2 lg:w-8 lg:h-3 rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.5), transparent)' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-xl lg:text-5xl font-black select-none"
              style={{
                color: 'transparent',
                WebkitTextStroke: '1.5px rgba(0,0,0,0.06)',
                textShadow: '2px 2px 3px rgba(255,255,255,0.9), -1px -1px 2px rgba(0,0,0,0.07), 0 0 1px rgba(0,0,0,0.03)',
                filter: 'blur(0.2px)',
              }}
            >
              {item.rank}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Avatar with fallback ──
const AvatarWithFallback = ({ src, alt, size = 'w-14 h-14', type = 'user' }) => {
  const [imgError, setImgError] = useState(false);

  if (!src || imgError) {
    return (
      <div className={`${size} rounded-full bg-slate-300 flex items-center justify-center ring-2 ring-[#e8e8ec] shadow-md shrink-0`}>
        {type === 'beach' ? (
          <svg className="w-4 h-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M17 21H7a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5 5 5 0 0 1 5-5 5 5 0 0 1 5 5h2a3 3 0 0 1 3 3v8a5 5 0 0 1-5 5z" /><path d="M7 21v-2" /><path d="M17 21v-2" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        )}
      </div>
    );
  }

  return (
    <img src={src} alt={alt} onError={() => setImgError(true)} className={`${size} rounded-full object-cover ring-2 ring-[#e8e8ec] shadow-md shrink-0`} />
  );
};

export default Dashboard;

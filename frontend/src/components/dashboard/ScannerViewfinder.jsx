import React from "react";
import { FOCUS_W, FOCUS_H } from "../../constants/dashboardData";

const ScannerViewfinder = ({
  videoRef,
  cameraActive,
  scanStep,
  isAnalyzing,
  cameraError,
  capturedImg,
  scanResult,
}) => {
  return (
    <div className="bg-black rounded-t-2xl overflow-hidden relative">
      <div className="w-full aspect-4/5 lg:aspect-video relative overflow-hidden">

        {/* Layer 0: Camera Feed / Captured Image */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 -scale-x-100 ${
            cameraActive && scanStep === 1 ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />
        {scanStep >= 2 && capturedImg && (
          <img
            src={capturedImg}
            alt="Captured"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          />
        )}

        {/* ── Layer 1: BLUR MASK — hanya saat live camera ── */}
        {scanStep === 1 && (
          <>
            {/* Top Panel */}
            <div
              className="absolute top-0 left-0 right-0 backdrop-blur-md bg-black/40 pointer-events-none z-10"
              style={{ height: `${(100 - FOCUS_H) / 2}%` }}
            />

            {/* Bottom Panel */}
            <div
              className="absolute bottom-0 left-0 right-0 backdrop-blur-md bg-black/40 pointer-events-none z-10"
              style={{ height: `${(100 - FOCUS_H) / 2}%` }}
            />

            {/* Middle: Left + Right panels flanking focus box */}
            <div
              className="absolute left-0 right-0 flex pointer-events-none z-10"
              style={{
                top: `${(100 - FOCUS_H) / 2}%`,
                height: `${FOCUS_H}%`,
              }}
            >
              <div
                className="h-full backdrop-blur-md bg-black/40"
                style={{ width: `${(100 - FOCUS_W) / 2}%` }}
              />
              <div className="h-full" style={{ width: `${FOCUS_W}%` }} />
              <div
                className="h-full backdrop-blur-md bg-black/40"
                style={{ width: `${(100 - FOCUS_W) / 2}%` }}
              />
            </div>
          </>
        )}

        {/* ── Layer 2: FOCUS BOX ── */}
        {scanStep === 1 && (
          <div
            className="absolute border border-white/10 rounded-xl pointer-events-none z-20"
            style={{
              top: `${(100 - FOCUS_H) / 2}%`,
              left: `${(100 - FOCUS_W) / 2}%`,
              width: `${FOCUS_W}%`,
              height: `${FOCUS_H}%`,
            }}
          >
            {/* Bracket Corners */}
            <div className="absolute -top-px -left-px w-10 h-10 border-t-[3px] border-l-[3px] border-white rounded-tl-xl" />
            <div className="absolute -top-px -right-px w-10 h-10 border-t-[3px] border-r-[3px] border-white rounded-tr-xl" />
            <div className="absolute -bottom-px -left-px w-10 h-10 border-b-[3px] border-l-[3px] border-white rounded-bl-xl" />
            <div className="absolute -bottom-px -right-px w-10 h-10 border-b-[3px] border-r-[3px] border-white rounded-br-xl" />

            {/* Vertical ticks */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-px w-0.5 h-14 bg-white" />
            <div className="absolute top-1/2 -translate-y-1/2 -right-px w-0.5 h-14 bg-white" />

            {/* Scanning Laser Line */}
            <div className="absolute inset-x-0 overflow-hidden pointer-events-none">
              <div className="h-0.5 bg-linear-to-r from-transparent via-white to-transparent shadow-[0_0_8px_rgba(255,255,255,0.4)] animate-scan" />
            </div>
          </div>
        )}

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
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <p className="text-white/50 text-[10px] font-mono tracking-widest">INITIALIZING CAMERA...</p>
              </div>
            )}
          </div>
        )}

        {/* Analyzing overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-2" />
            <p className="text-white text-[10px] font-mono tracking-[0.2em] animate-pulse">ANALYZING...</p>
          </div>
        )}

        {/* ── Step 2: Callout Lines + Labels ── */}
        {scanStep === 2 && (
          <div className="absolute inset-0 z-40 pointer-events-none">
            {/* OBJ (Left Side) */}
            <div className="absolute left-[5%] lg:left-[10%] top-[45%] flex items-center z-50 pointer-events-none">
              <div className="bg-white/90 backdrop-blur-sm px-1.5 py-0.5 lg:px-2 lg:py-1 rounded mr-1 lg:mr-2">
                <span className="text-[6px] lg:text-[8px] font-bold text-black/40 uppercase tracking-widest leading-none block">Objek</span>
                <span className="text-[10px] lg:text-xs font-extrabold text-black leading-tight capitalize">{scanResult?.waste_type || "—"}</span>
              </div>
              <svg width="80" height="40" viewBox="0 0 450 100" fill="none" className="overflow-visible lg:w-55 lg:h-20">
                <path d="M0 10 H380 L420 70" stroke="black" strokeWidth="5" strokeLinecap="round" />
                <circle cx="0" cy="10" r="5" fill="black" />
                <circle cx="420" cy="70" r="10" fill="black" fillOpacity="0.15" />
                <circle cx="420" cy="70" r="5" fill="black" />
              </svg>
            </div>

            {/* CONF (Right Top) */}
            <div className="absolute right-[8%] lg:right-[16%] top-[35%] flex items-center z-50 pointer-events-none">
              <svg width="80" height="40" viewBox="0 0 450 100" fill="none" className="overflow-visible lg:w-55 lg:h-20">
                <path d="M30 70 L70 10 H450" stroke="black" strokeWidth="5" strokeLinecap="round" />
                <circle cx="30" cy="70" r="10" fill="black" fillOpacity="0.15" />
                <circle cx="30" cy="70" r="5" fill="black" />
                <circle cx="450" cy="10" r="5" fill="black" />
              </svg>
              <div className="bg-white/90 backdrop-blur-sm px-1.5 py-0.5 lg:px-2 lg:py-1 rounded ml-1 lg:ml-2">
                <span className="text-[6px] lg:text-[8px] font-bold text-black/40 uppercase tracking-widest leading-none block">Conf</span>
                <span className="text-[10px] lg:text-xs font-extrabold text-black leading-tight">{scanResult?.confidence ? `${(scanResult.confidence * 100).toFixed(1)}%` : "—"}</span>
              </div>
            </div>

            {/* REC (Right Bottom) */}
            <div className="absolute right-[8%] lg:right-[15%] bottom-[30%] flex items-center z-50 pointer-events-none">
              <svg width="80" height="40" viewBox="0 0 450 100" fill="none" className="overflow-visible lg:w-55 lg:h-20">
                <path d="M30 70 L70 10 H450" stroke="black" strokeWidth="5" strokeLinecap="round" />
                <circle cx="30" cy="70" r="10" fill="black" fillOpacity="0.15" />
                <circle cx="30" cy="70" r="5" fill="black" />
                <circle cx="450" cy="10" r="5" fill="black" />
              </svg>
              <div className="bg-white/90 backdrop-blur-sm px-1.5 py-0.5 lg:px-2 lg:py-1 rounded ml-1 lg:ml-2">
                <span className="text-[6px] lg:text-[8px] font-bold text-black/40 uppercase tracking-widest leading-none block">Daur Ulang</span>
                <span className="text-[10px] lg:text-xs font-extrabold text-black leading-tight">{scanResult?.recyclable === "Yes" ? "YA" : "TIDAK"}</span>
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
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ScannerViewfinder;

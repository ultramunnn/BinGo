import React from "react";
import { IconRefresh } from "./Icons";

const ResultConsole = ({ scanStep, isAnalyzing, onStepChange, onReset }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col flex-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold tracking-tight text-slate-400 uppercase font-mono">Result Console</h2>
        <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded font-bold">
          STEP {scanStep}/3
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
            <div className="w-7 h-7 border-2 border-cyan-200 border-t-cyan-600 rounded-full animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest mb-1">Executing Tensor</p>
            <p className="text-xs text-slate-600 font-medium animate-pulse">Mengklasifikasikan objek...</p>
          </div>
        </div>
      )}

      {scanStep === 2 && (
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
            onClick={() => onStepChange(3)}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2.5 rounded-xl text-xs font-mono transition-all"
          >
            VALIDATE GEOLOCATION (STEP 3) &rarr;
          </button>
        </div>
      )}

      {scanStep === 3 && (
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
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-xs font-mono transition-all"
          >
            <IconRefresh className="w-3.5 h-3.5" />
            RESET &amp; SCAN BARU
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultConsole;

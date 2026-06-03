import React from "react";
import { useNavigate } from "react-router-dom";
import { IconRefresh } from "./Icons";
import SvgComponent from "../svg/SvgComponent";

const ResultConsole = ({
  scanStep,
  isAnalyzing,
  scanResult,
  gpsCoords,
  gpsError,
  onStepChange,
  onReset,
}) => {
  const navigate = useNavigate();
  return (
    <div data-tour="result-console" className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col flex-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm text-slate-600 font-mono font-semibold">
          Konsol Hasil
        </h2>
        <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded font-bold">
          LANGKAH {scanStep}/3
        </span>
      </div>

      {scanStep === 1 && !isAnalyzing && (
        <div className="flex flex-col items-center justify-center flex-1 gap-4 py-6">
          <SvgComponent className="w-20 h-20 text-slate-300" />
          <div className="text-center">
            <p className="text-xs text-slate-500 font-medium">
              Tekan shutter untuk mulai scan
            </p>
            {gpsCoords && (
              <p className="text-[10px] text-emerald-500 font-mono mt-1">
                GPS: {gpsCoords.latitude.toFixed(4)},{" "}
                {gpsCoords.longitude.toFixed(4)}
              </p>
            )}
            {gpsError && (
              <p className="text-[10px] text-amber-500 font-mono mt-1">
                {gpsError}
              </p>
            )}
          </div>
        </div>
      )}

      {scanStep === 1 && isAnalyzing && (
        <div className="flex flex-col items-center justify-center flex-1 gap-4 py-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 border border-cyan-200/60 flex items-center justify-center">
            <div className="w-7 h-7 border-2 border-cyan-200 border-t-cyan-600 rounded-full animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest mb-1">
              Menjalankan Tensor
            </p>
            <p className="text-xs text-slate-600 font-medium animate-pulse">
              Mengklasifikasikan objek...
            </p>
          </div>
        </div>
      )}

      {scanStep === 2 && scanResult && !scanResult.error && (
        <div className="flex flex-col gap-4 flex-1">
          <div className="grid grid-cols-2 gap-2 font-mono text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="text-[9px] text-slate-400 block font-bold">
                MATERIAL
              </span>
              <span className="text-xs font-extrabold text-slate-800 capitalize">
                {scanResult.waste_type}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col items-center justify-center">
              <span className="text-[9px] text-slate-400 block font-bold mb-0.5">
                DAUR ULANG
              </span>
              <span
                className={`text-xs font-bold ${scanResult.recyclable === "Yes" ? "text-emerald-600" : "text-red-500"}`}
              >
                {scanResult.recyclable === "Yes" ? "✓ BISA" : "✗ TIDAK"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-center">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="text-[9px] text-slate-400 block font-bold">
                KEPERCAYAAN
              </span>
              <span className="text-xs font-bold text-slate-800">
                {(scanResult.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="text-[9px] text-slate-400 block font-bold">
                PENANGANAN
              </span>
              <span className="text-[10px] font-bold text-slate-800 capitalize">
                {scanResult.treatment}
              </span>
            </div>
          </div>

          {scanResult.ai_recommendation && (
            <div className="bg-cyan-50 border border-cyan-100 p-3.5 rounded-xl text-[11px] text-slate-700 leading-relaxed">
              <span className="font-bold text-cyan-800 block mb-0.5">
                Rekomendasi AI:
              </span>
              {scanResult.ai_recommendation}
            </div>
          )}

          <div className="bg-slate-900 text-white p-3 rounded-xl font-mono text-[10px]">
            <span className="text-cyan-400 uppercase tracking-widest font-bold">
              LOKASI
            </span>
            <div className="mt-1">
              {scanResult.location_name ? (
                <span className="text-white font-bold">
                  {scanResult.location_name}
                </span>
              ) : (
                <span className="text-slate-400">
                  GPS: {scanResult.latitude?.toFixed(4)},{" "}
                  {scanResult.longitude?.toFixed(4)}
                </span>
              )}
            </div>
          </div>

          {scanResult.beach_id && (
            <button
              data-tour="beach-review"
              onClick={() => navigate(`/maps?beach=${scanResult.beach_id}`)}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 rounded-xl text-xs font-mono transition-all"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              ULAS {scanResult.beach_name || "PANTAI INI"}
            </button>
          )}

          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-xs font-mono transition-all"
          >
            Atur Ulang &amp; Memindai Baru
          </button>
        </div>
      )}

      {scanStep === 2 && scanResult?.error && (
        <div className="flex flex-col gap-4 flex-1">
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
            <p className="text-xs text-red-700 font-semibold mb-1">
              Scan Gagal
            </p>
            <p className="text-[11px] text-red-600">{scanResult.error}</p>
          </div>
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl text-xs font-mono transition-all"
          >
            <IconRefresh className="w-3.5 h-3.5" />
            COBA LAGI
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultConsole;

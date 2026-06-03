import React from "react";
import { IconUpload, IconFlip } from "./Icons";

const ControlBar = ({
  fileInputRef,
  onFileChange,
  onUploadClick,
  onShutter,
  onFlip,
  isAnalyzing,
  cameraError,
}) => {
  return (
    <div data-tour="control-bar" className="bg-slate-900 rounded-b-2xl px-5 py-4 flex items-center justify-between">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onFileChange} />

      <button
        onClick={onUploadClick}
        disabled={isAnalyzing}
        className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-400 hover:text-white rounded-xl text-xs font-mono border border-white/10 transition-all active:scale-95"
      >
        <IconUpload className="w-4 h-4" />
        <span className="hidden sm:inline">UNGGAH</span>
      </button>

      <div className="relative group">
        <button
          onClick={onShutter}
          disabled={isAnalyzing || !!cameraError}
          className="w-14 h-14 bg-white hover:bg-slate-200 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-full flex items-center justify-center ring-[3px] ring-white/20 hover:ring-white/40 disabled:ring-white/10 transition-all active:scale-90 shadow-lg group"
        >
          <div className={`w-11 h-11 rounded-full border-2 transition-all ${isAnalyzing ? "bg-slate-600 border-slate-500 scale-75" : cameraError ? "border-slate-600" : "border-slate-900/10 group-hover:scale-95"}`} />
        </button>
        {cameraError && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap bg-slate-800 text-white text-[9px] font-mono px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            Kamera mati &mdash; gunakan Upload
          </div>
        )}
      </div>

      <button
        onClick={onFlip}
        disabled={isAnalyzing}
        className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-400 hover:text-white rounded-xl text-xs font-mono border border-white/10 transition-all active:scale-95"
      >
        <IconFlip className="w-4 h-4" />
        <span className="hidden sm:inline">BALIK</span>
      </button>
    </div>
  );
};

export default ControlBar;

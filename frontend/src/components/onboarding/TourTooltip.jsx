import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ChevronLeft } from "lucide-react";

/**
 * Custom tooltip rendered by react-joyride for each tour step.
 *
 * Props (injected by Joyride via `tooltipComponent`):
 * - step: { title, description, icon, iconColor, iconBg }
 * - index: current step index
 * - size: total number of steps
 * - backProps / closeProps / primaryProps: accessibility + click handlers
 * - isLastStep: boolean
 */
const TourTooltip = ({
  step,
  index,
  size,
  backProps,
  closeProps,
  primaryProps,
  isLastStep,
}) => {
  const StepIcon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="relative w-[min(88vw,360px)] bg-white rounded-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)] border border-slate-100 overflow-hidden font-sans"
    >
      <button
        {...closeProps}
        className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        aria-label="Tutup tur"
      >
        <X size={14} strokeWidth={2.5} />
      </button>

      <div className="p-5 pb-4">
        <div className="flex gap-4">
          {StepIcon && (
            <div
              className={`shrink-0 w-11 h-11 rounded-xl ${step.iconBg || "bg-slate-50"} flex items-center justify-center`}
            >
              <StepIcon
                size={22}
                strokeWidth={2}
                className={step.iconColor || "text-slate-600"}
              />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-bold text-slate-800 leading-snug pr-6">
              {step.title}
            </h3>
            <p className="text-[13px] text-slate-500 leading-relaxed mt-1.5">
              {step.description}
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: size }).map((_, i) => (
            <span
              key={i}
              className={`block rounded-full transition-all duration-300 ${
                i === index
                  ? "w-5 h-1.5 bg-slate-800"
                  : i < index
                    ? "w-1.5 h-1.5 bg-slate-400"
                    : "w-1.5 h-1.5 bg-slate-200"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          {index > 0 && (
            <button
              {...backProps}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ChevronLeft size={13} />
              Kembali
            </button>
          )}

          {index === 0 && (
            <button
              {...closeProps}
              className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Lewati
            </button>
          )}

          <button
            {...primaryProps}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-full transition-all active:scale-95 shadow-md cursor-pointer"
          >
            {isLastStep ? "Mulai" : "Lanjut"}
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowRight size={12} strokeWidth={2.5} />
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TourTooltip;

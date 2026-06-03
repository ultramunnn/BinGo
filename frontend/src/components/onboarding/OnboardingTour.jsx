import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ChevronLeft, CircleHelp } from "lucide-react";
import TOUR_STEPS from "../../constants/tourSteps";

const STORAGE_KEY = "bingo_onboarding_completed";
const NAVBAR_H = 72;
const SPOTLIGHT_PAD = 6;
const ARROW_SIZE = 14;
const TOOLTIP_W = 360;
const TOOLTIP_H = 240;

function getTargetRect(selector) {
  try {
    const el = document.querySelector(selector);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      top: r.top,
      left: r.left,
      right: r.right,
      bottom: r.bottom,
      width: r.width,
      height: r.height,
      centerX: r.left + r.width / 2,
      centerY: r.top + r.height / 2,
    };
  } catch {
    return null;
  }
}

function getTooltipPosition(rect, tooltipW, tooltipH) {
  if (!rect) return { top: window.innerHeight / 2 - tooltipH / 2, left: window.innerWidth / 2 - tooltipW / 2, placement: "center" };

  const gap = ARROW_SIZE + 4;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const minTop = NAVBAR_H + 8;

  if (rect.right + gap + tooltipW < vw) {
    return {
      top: Math.max(minTop, Math.min(rect.centerY - tooltipH / 2, vh - tooltipH - 8)),
      left: rect.right + gap,
      placement: "right",
    };
  }
  if (rect.left - gap - tooltipW > 0) {
    return {
      top: Math.max(minTop, Math.min(rect.centerY - tooltipH / 2, vh - tooltipH - 8)),
      left: rect.left - gap - tooltipW,
      placement: "left",
    };
  }
  if (rect.bottom + gap + tooltipH < vh) {
    return {
      top: Math.max(minTop, rect.bottom + gap),
      left: Math.max(8, Math.min(rect.centerX - tooltipW / 2, vw - tooltipW - 8)),
      placement: "below",
    };
  }
  if (rect.top - gap - tooltipH > minTop) {
    return {
      top: rect.top - gap - tooltipH,
      left: Math.max(8, Math.min(rect.centerX - tooltipW / 2, vw - tooltipW - 8)),
      placement: "above",
    };
  }
  return { top: minTop, left: Math.max(8, vw / 2 - tooltipW / 2), placement: "below" };
}

const Arrow = ({ placement, targetCenter, tooltipPos }) => {
  if (placement === "center") return null;

  const s = ARROW_SIZE;
  let style = {};

  switch (placement) {
    case "below":
      // Tooltip below target → arrow on top, points UP ↑
      style = {
        top: -s,
        left: targetCenter.x - tooltipPos.left - s,
        borderWidth: `0 ${s}px ${s}px ${s}px`,
        borderColor: "transparent transparent white transparent",
      };
      break;
    case "above":
      style = {
        bottom: -s,
        left: targetCenter.x - tooltipPos.left - s,
        borderWidth: `${s}px ${s}px 0 ${s}px`,
        borderColor: "white transparent transparent transparent",
      };
      break;
    case "left":
      style = {
        right: -s,
        top: targetCenter.y - tooltipPos.top - s,
        borderWidth: `${s}px 0 ${s}px ${s}px`,
        borderColor: "transparent transparent transparent white",
      };
      break;
    case "right":
      style = {
        left: -s,
        top: targetCenter.y - tooltipPos.top - s,
        borderWidth: `${s}px ${s}px ${s}px 0`,
        borderColor: "transparent white transparent transparent",
      };
      break;
  }

  return (
    <div
      className="absolute z-10 pointer-events-none"
      style={{
        ...style,
        width: 0,
        height: 0,
        borderStyle: "solid",
      }}
    />
  );
};

const TourStep = ({ step, index, total, onNext, onBack, onClose }) => {
  const [rect, setRect] = useState(null);
  const [pos, setPos] = useState(null);
  const tooltipRef = useRef(null);
  const StepIcon = step.icon;

  useEffect(() => {
    let raf;
    let scrollTimeout;

    const computePosition = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = getTargetRect(step.target);
        setRect(r);
        if (r) {
          const el = tooltipRef.current;
          const tw = el?.offsetWidth || TOOLTIP_W;
          const th = el?.offsetHeight || TOOLTIP_H;
          setPos(getTooltipPosition(r, tw, th));
        }
      });
    };

    try {
      const el = document.querySelector(step.target);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    } catch {}

    scrollTimeout = setTimeout(computePosition, 400);
    window.addEventListener("resize", computePosition);

    return () => {
      clearTimeout(scrollTimeout);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", computePosition);
    };
  }, [step.target]);

  const isLast = index === total - 1;

  const ready = rect && pos;

  return (
    <motion.div
      className="fixed inset-0 z-[10000]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0" />

      {rect && (
        <motion.div
          className="absolute rounded-lg pointer-events-none"
          style={{
            top: rect.top - SPOTLIGHT_PAD,
            left: rect.left - SPOTLIGHT_PAD,
            width: rect.width + SPOTLIGHT_PAD * 2,
            height: rect.height + SPOTLIGHT_PAD * 2,
            boxShadow:
              "0 0 0 9999px rgba(0, 0, 0, 0.50), 0 0 0 3px rgba(255,255,255,0.7), 0 0 30px 4px rgba(255,255,255,0.15)",
          }}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
        />
      )}

      {ready && (
        <motion.div
          ref={tooltipRef}
          className="absolute z-10001 w-[min(88vw,360px)] bg-white rounded-xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)] border border-slate-100 overflow-visible font-sans"
          style={{ top: pos.top, left: pos.left }}
          initial={{ opacity: 0, y: 6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <Arrow
            placement={pos.placement}
            targetCenter={{ x: rect.centerX, y: rect.centerY }}
            tooltipPos={pos}
          />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={14} strokeWidth={2.5} />
          </button>

          <div className="p-5 pb-4">
            <div className="flex gap-4">
              {StepIcon && (
                <div className={`shrink-0 w-11 h-11 rounded-xl ${step.iconBg || "bg-slate-50"} flex items-center justify-center`}>
                  <StepIcon size={22} strokeWidth={2} className={step.iconColor || "text-slate-600"} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="text-[15px] font-bold text-slate-800 leading-snug pr-6">{step.title}</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed mt-1.5">{step.description}</p>
              </div>
            </div>
          </div>

          <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-xl">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: total }).map((_, i) => (
                <span
                  key={i}
                  className={`block rounded-full transition-all duration-300 ${
                    i === index ? "w-5 h-1.5 bg-slate-800" : i < index ? "w-1.5 h-1.5 bg-slate-400" : "w-1.5 h-1.5 bg-slate-200"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {index > 0 ? (
                <button onClick={onBack} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                  <ChevronLeft size={13} /> Kembali
                </button>
              ) : (
                <button onClick={onClose} className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                  Lewati
                </button>
              )}
              <button onClick={onNext} className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-full transition-all active:scale-95 shadow-md cursor-pointer">
                {isLast ? "Mulai" : "Lanjut"}
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <ArrowRight size={12} strokeWidth={2.5} />
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export const TourReplayButton = ({ onReplay }) => (
  <motion.button
    onClick={onReplay}
    className="fixed bottom-20 lg:bottom-6 right-4 z-9999 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg hover:bg-slate-800 transition-colors cursor-pointer"
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.95 }}
    title="Panduan penggunaan"
  >
    <CircleHelp size={18} strokeWidth={2} />
  </motion.button>
);

const OnboardingTour = () => {
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState([]);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "true") return;
    } catch {
      return;
    }
    const timer = setTimeout(() => {
      const valid = TOUR_STEPS.filter((s) => {
        try { return document.querySelector(s.target) !== null; } catch { return false; }
      });
      if (valid.length > 0) {
        setVisibleSteps(valid);
        setActive(true);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (active) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [active]);

  const close = useCallback(() => {
    try { localStorage.setItem(STORAGE_KEY, "true"); } catch {}
    setActive(false);
    setStepIndex(0);
  }, []);

  const next = useCallback(() => {
    setStepIndex((prev) => {
      if (prev >= visibleSteps.length - 1) { close(); return 0; }
      return prev + 1;
    });
  }, [visibleSteps.length, close]);

  const back = useCallback(() => {
    setStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleReplay = useCallback(() => {
    const valid = TOUR_STEPS.filter((s) => {
      try { return document.querySelector(s.target) !== null; } catch { return false; }
    });
    if (valid.length > 0) {
      setVisibleSteps(valid);
      setStepIndex(0);
      setActive(true);
    }
  }, []);

  return (
    <>
      {!active && <TourReplayButton onReplay={handleReplay} />}

      {active && visibleSteps.length > 0 && (
        <AnimatePresence mode="wait">
          <TourStep
            key={stepIndex}
            step={visibleSteps[stepIndex]}
            index={stepIndex}
            total={visibleSteps.length}
            onNext={next}
            onBack={back}
            onClose={close}
          />
        </AnimatePresence>
      )}
    </>
  );
};

export default OnboardingTour;

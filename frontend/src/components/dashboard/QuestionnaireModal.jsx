import React from "react";
import { MATERIAL_RULES, QUESTION_POOL } from "../../constants/dashboardData";

const QuestionnaireModal = ({
  showModal,
  currentMaterial,
  questionIndex,
  setQuestionIndex,
  questionnaireAnswers,
  setQuestionnaireAnswers,
  onSubmit,
}) => {
  if (!showModal || !currentMaterial) return null;

  const activeFields = MATERIAL_RULES[currentMaterial] || [];
  const progress = activeFields.length > 0
    ? ((questionIndex + 1) / activeFields.length) * 100
    : 0;
  const currentKey = activeFields[questionIndex];
  const currentQ = currentKey ? QUESTION_POOL[currentKey] : null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Overlay backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal card */}
      <div className="relative bg-white w-full max-w-lg max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
            Kuesioner Pemilahan Sampah
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Jenis material: <span className="font-semibold text-slate-600">{currentMaterial}</span>
          </p>
        </div>

        {/* Progress indicator */}
        <div className="px-6 pt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono text-slate-400">
              Pertanyaan {questionIndex + 1} / {activeFields.length}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-900 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Single question view */}
        <div className="flex-1 px-6 py-6 flex flex-col justify-center">
          {currentQ && (
            <div key={`${currentKey}-${questionIndex}`} className="animate-fade-in">
              {/* Back & Next navigation */}
              <div className="flex items-center justify-between mb-4 min-h-[20px]">
                {questionIndex > 0 ? (
                  <button
                    onClick={() => setQuestionIndex((i) => i - 1)}
                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                    Kembali
                  </button>
                ) : (
                  <span />
                )}

                {questionIndex < activeFields.length - 1 && questionnaireAnswers[currentKey] && (
                  <button
                    onClick={() => setQuestionIndex((i) => i + 1)}
                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    Selanjutnya
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                )}
              </div>

              <p className="text-sm font-semibold text-slate-800 mb-1">
                {currentQ.question}
              </p>
              {currentQ.hint && (
                <p className="text-[10px] text-slate-400 mb-4">{currentQ.hint}</p>
              )}
              {!currentQ.hint && <div className="mb-4" />}

              <div className="flex flex-col gap-2">
                {currentQ.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setQuestionnaireAnswers((prev) => ({ ...prev, [currentKey]: opt }));
                      if (questionIndex < activeFields.length - 1) {
                        setTimeout(() => setQuestionIndex((i) => i + 1), 200);
                      }
                    }}
                    className={`w-full text-left px-4 py-3 text-xs rounded-xl border transition-all cursor-pointer ${
                      questionnaireAnswers[currentKey] === opt
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:shadow-sm"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100">
          <button
            onClick={onSubmit}
            disabled={!activeFields.every((k) => questionnaireAnswers[k])}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-xs font-mono transition-all cursor-pointer"
          >
            KIRIM &amp; ANALISIS
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireModal;

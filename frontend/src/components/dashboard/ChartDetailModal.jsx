import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const PALETTE = {
  recyclable: "#059669",
  nonRecyclable: "#dc2626",
  gaugeTrack: "#f1f5f9",
  gaugeRed: "#fca5a5",
  gaugeYellow: "#fcd34d",
  gaugeGreen: "#6ee7b7",
  needle: "#1e293b",
  barTop: "#4f46e5",
  barOther: "#e0e7ff",
  textPrimary: "#1e293b",
  textSecondary: "#64748b",
  textMuted: "#94a3b8",
};

function getConfidenceLabel(value) {
  if (value >= 0.8) return "Sangat yakin";
  if (value >= 0.6) return "Yakin";
  if (value >= 0.4) return "Cukup yakin";
  return "Kurang yakin";
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;
  return (
    <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-lg">
      <p className="text-[11px] font-medium">{name}</p>
      <p className="text-sm font-bold">{value}%</p>
    </div>
  );
};

const GaugeMeter = ({ value, label, sublabel }) => {
  const pct = Math.round(value * 100);
  const angle = -90 + value * 180;

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-semibold text-slate-600">{label}</span>
      <div className="relative w-36 h-24">
        <svg viewBox="0 0 100 55" className="w-full h-full">
          <path
            d="M 8 50 A 42 42 0 0 1 92 50"
            fill="none"
            stroke={PALETTE.gaugeTrack}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 8 50 A 42 42 0 0 1 35 13"
            fill="none"
            stroke={PALETTE.gaugeRed}
            strokeWidth="7"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M 35 13 A 42 42 0 0 1 65 13"
            fill="none"
            stroke={PALETTE.gaugeYellow}
            strokeWidth="7"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M 65 13 A 42 42 0 0 1 92 50"
            fill="none"
            stroke={PALETTE.gaugeGreen}
            strokeWidth="7"
            strokeLinecap="round"
            opacity="0.5"
          />

          <g transform={`rotate(${angle}, 50, 50)`}>
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="18"
              stroke={PALETTE.needle}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="50" cy="50" r="3" fill={PALETTE.needle} />
          </g>
        </svg>
        <div className="absolute bottom-5 left-0 right-0 text-center">
          <span className="text-lg font-black text-slate-800">{pct}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[11px] font-semibold text-slate-700 capitalize">
          {sublabel}
        </p>
        <p className="text-[10px] text-slate-400">
          {getConfidenceLabel(value)}
        </p>
      </div>
    </div>
  );
};

const ConfidenceBar = ({ data }) => {
  const sorted = Object.entries(data)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value]) => ({ name, value: Math.round(value * 1000) / 10 }));

  const maxVal = Math.max(...sorted.map((d) => d.value), 1);

  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-xs font-semibold text-slate-600 text-center">
        Confidence per Type
      </span>
      {sorted.map((item, idx) => {
        const isTop = idx === 0;
        const barWidth = Math.max((item.value / maxVal) * 100, 0);

        return (
          <div key={item.name} className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-500 w-14 text-right capitalize shrink-0">
              {item.name}
            </span>
            <div className="flex-1 h-6 bg-slate-50 rounded-md overflow-hidden">
              {barWidth > 0 && (
                <div
                  className="h-full rounded-md transition-all duration-700 ease-out"
                  style={{
                    width: `${barWidth}%`,
                    background: isTop ? PALETTE.barTop : PALETTE.barOther,
                  }}
                />
              )}
            </div>
            <span
              className="text-[10px] font-bold w-10 text-right shrink-0"
              style={{ color: isTop ? PALETTE.barTop : PALETTE.textSecondary }}
            >
              {item.value}%
            </span>
          </div>
        );
      })}
    </div>
  );
};

const ChartDetailModal = ({ open, onClose, scanResult }) => {
  if (!open || !scanResult) return null;

  const isRecyclable = scanResult.recyclable === "Yes";
  const confidence =
    Math.round((scanResult.recyclable_confidence || 0) * 1000) / 10;
  const recyclablePct = isRecyclable ? confidence : 100 - confidence;
  const nonRecyclablePct = 100 - recyclablePct;

  const pieData = [
    {
      name: "Bisa Didaur Ulang",
      value: recyclablePct,
      color: PALETTE.recyclable,
    },
    {
      name: "Tidak Bisa",
      value: nonRecyclablePct,
      color: PALETTE.nonRecyclable,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">
            Detail Hasil Scan
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            <span className="capitalize font-medium text-slate-600">
              {scanResult.waste_type}
            </span>
            <span className="mx-1.5">·</span>
            Confidence {Math.round((scanResult.confidence || 0) * 1000) / 10}%
          </p>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">
              Recyclability
            </span>
            <div className="w-full h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="85%"
                    paddingAngle={
                      recyclablePct === 100 || nonRecyclablePct === 100 ? 0 : 3
                    }
                    dataKey="value"
                    strokeWidth={0}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-3">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: entry.color }}
                  />
                  <span className="text-[10px] text-slate-500">
                    {entry.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <GaugeMeter
            value={scanResult.treatment_confidence || 0}
            label="Treatment"
            sublabel={scanResult.treatment || "-"}
          />

          {scanResult.cv_probabilities &&
          Object.keys(scanResult.cv_probabilities).length > 0 ? (
            <ConfidenceBar data={scanResult.cv_probabilities} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-xs font-semibold text-slate-600">
                Confidence per Type
              </span>
              <p className="text-[11px] text-slate-400">Data tidak tersedia</p>
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-slate-100 sm:hidden">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChartDetailModal;

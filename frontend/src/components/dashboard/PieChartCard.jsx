import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = {
  yes: "#10b981",
  no: "#ef4444",
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;
  return (
    <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-lg">
      <p className="text-[11px] font-semibold">{name}</p>
      <p className="text-sm font-bold">{value}%</p>
    </div>
  );
};

const PieChartCard = ({ scanResult, onDetailClick }) => {
  const hasResult = scanResult && !scanResult.error;

  let chartData;

  if (hasResult) {
    const isRecyclable = scanResult.recyclable === "Yes";
    const recyclablePct = isRecyclable
      ? Math.round((scanResult.recyclable_confidence || 0) * 100)
      : Math.round((1 - (scanResult.recyclable_confidence || 0)) * 100);
    const nonRecyclablePct = 100 - recyclablePct;
    chartData = [
      { name: "Bisa Didaur Ulang", value: recyclablePct, color: COLORS.yes },
      { name: "Tidak Bisa", value: nonRecyclablePct, color: COLORS.no },
    ];
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col flex-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm text-slate-600 font-mono font-semibold">
          Grafik Chart
        </h2>
        <span className="text-[10px] font-mono text-slate-400">
          {hasResult ? "Hasil Scan" : "Menunggu Scan"}
        </span>
      </div>

      <div className="flex-1 min-h-50 flex items-center justify-center">
        {hasResult ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={
                  chartData[0].value === 100 || chartData[1].value === 100
                    ? 0
                    : 3
                }
                dataKey="value"
                strokeWidth={0}
                startAngle={90}
                endAngle={-270}
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <svg
              className="w-20 h-20 text-slate-300"
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <path
                d="M660 103.2l-149.6 76 2.4 1.6-2.4-1.6-157.6-80.8L32 289.6l148.8 85.6v354.4l329.6-175.2 324.8 175.2V375.2L992 284.8z"
                fill="#FFFFFF"
              ></path>
              <path
                d="M180.8 737.6c-1.6 0-3.2 0-4-0.8-2.4-1.6-4-4-4-7.2V379.2L28 296c-2.4-0.8-4-4-4-6.4s1.6-5.6 4-7.2l320.8-191.2c2.4-1.6 5.6-1.6 8 0l154.4 79.2L656 96c2.4-1.6 4.8-0.8 7.2 0l332 181.6c2.4 1.6 4 4 4 7.2s-1.6 5.6-4 7.2l-152.8 88v350.4c0 3.2-1.6 5.6-4 7.2-2.4 1.6-5.6 1.6-8 0l-320-174.4-325.6 173.6c-1.6 0.8-2.4 0.8-4 0.8zM48 289.6L184.8 368c2.4 1.6 4 4 4 7.2v341.6l317.6-169.6c2.4-1.6 5.6-1.6 7.2 0l312.8 169.6V375.2c0-3.2 1.6-5.6 4-7.2L976 284.8 659.2 112.8 520 183.2c0 0.8-0.8 0.8-0.8 1.6-2.4 4-7.2 4.8-11.2 2.4l-1.6-1.6h-0.8l-152.8-78.4L48 289.6z"
                fill="#6A576D"
              ></path>
              <path
                d="M510.4 179.2l324.8 196v354.4L510.4 554.4z"
                fill="#121519"
              ></path>
              <path
                d="M510.4 179.2L180.8 375.2v354.4l329.6-175.2z"
                fill="#121519"
              ></path>
              <path
                d="M835.2 737.6c-1.6 0-2.4 0-4-0.8l-324.8-176c-2.4-1.6-4-4-4-7.2V179.2c0-3.2 1.6-5.6 4-7.2 2.4-1.6 5.6-1.6 8 0L839.2 368c2.4 1.6 4 4 4 7.2v355.2c0 3.2-1.6 5.6-4 7.2h-4zM518.4 549.6l308.8 167.2V379.2L518.4 193.6v356z"
                fill="#6A576D"
              ></path>
              <path
                d="M180.8 737.6c-1.6 0-3.2 0-4-0.8-2.4-1.6-4-4-4-7.2V375.2c0-3.2 1.6-5.6 4-7.2l329.6-196c2.4-1.6 5.6-1.6 8 0 2.4 1.6 4 4 4 7.2v375.2c0 3.2-1.6 5.6-4 7.2l-329.6 176h-4z m8-358.4v337.6l313.6-167.2V193.6L188.8 379.2z"
                fill="#6A576D"
              ></path>
              <path
                d="M510.4 550.4L372 496 180.8 374.4v355.2l329.6 196 324.8-196V374.4L688.8 483.2z"
                fill="#D6AB7F"
              ></path>
              <path
                d="M510.4 933.6c-1.6 0-3.2 0-4-0.8L176.8 736.8c-2.4-1.6-4-4-4-7.2V374.4c0-3.2 1.6-5.6 4-7.2 2.4-1.6 5.6-1.6 8 0L376 488.8l135.2 53.6 174.4-66.4L830.4 368c2.4-1.6 5.6-2.4 8-0.8 2.4 1.6 4 4 4 7.2v355.2c0 3.2-1.6 5.6-4 7.2l-324.8 196s-1.6 0.8-3.2 0.8z m-321.6-208l321.6 191.2 316.8-191.2V390.4L693.6 489.6c-0.8 0.8-1.6 0.8-1.6 0.8l-178.4 68c-1.6 0.8-4 0.8-5.6 0L369.6 504c-0.8 0-0.8-0.8-1.6-0.8L188.8 389.6v336z"
                fill="#6A576D"
              ></path>
              <path
                d="M510.4 925.6l324.8-196V374.4L665.6 495.2l-155.2 55.2z"
                fill="#121519"
              ></path>
              <path
                d="M510.4 933.6c-1.6 0-2.4 0-4-0.8-2.4-1.6-4-4-4-7.2V550.4c0-3.2 2.4-6.4 5.6-7.2L662.4 488l168-120c2.4-1.6 5.6-1.6 8-0.8 2.4 1.6 4 4 4 7.2v355.2c0 3.2-1.6 5.6-4 7.2l-324.8 196s-1.6 0.8-3.2 0.8z m8-377.6v355.2l308.8-185.6V390.4L670.4 501.6c-0.8 0.8-1.6 0.8-1.6 0.8l-150.4 53.6z"
                fill="#6A576D"
              ></path>
              <path
                d="M252.8 604l257.6 145.6V550.4l-147.2-49.6-182.4-126.4z"
                fill="#121519"
              ></path>
              <path
                d="M32 460l148.8-85.6 329.6 176L352 640.8z"
                fill="#FFFFFF"
              ></path>
              <path
                d="M659.2 693.6l176-90.4V375.2L692 480.8l-179.2 68-2.4 1.6z"
                fill="#121519"
              ></path>
              <path
                d="M510.4 550.4l148.8 85.6L992 464.8l-156.8-89.6z"
                fill="#FFFFFF"
              ></path>
              <path
                d="M352 648.8c-1.6 0-2.4 0-4-0.8l-320-180.8c-2.4-1.6-4-4-4-7.2s1.6-5.6 4-7.2L176.8 368c2.4-1.6 5.6-1.6 8 0l329.6 176c2.4 1.6 4 4 4 7.2s-1.6 5.6-4 7.2L356 648c-0.8 0.8-2.4 0.8-4 0.8zM48 460L352 632l141.6-80.8L180.8 384 48 460z"
                fill="#6A576D"
              ></path>
              <path
                d="M659.2 644c-1.6 0-2.4 0-4-0.8L506.4 557.6c-2.4-1.6-4-4-4-7.2s1.6-5.6 4-7.2l324.8-176c2.4-1.6 5.6-1.6 8 0l156.8 90.4c2.4 1.6 4 4 4 7.2s-1.6 5.6-4 7.2L663.2 643.2c-1.6 0.8-2.4 0.8-4 0.8zM527.2 550.4l132.8 76L976 464l-141.6-80-307.2 166.4z"
                fill="#6A576D"
              ></path>
            </svg>
            <div>
              <p className="text-xs font-semibold text-slate-400">
                Belum ada data
              </p>
              <p className="text-[10px] text-slate-300 mt-0.5">
                Scan sampah untuk melihat hasil
              </p>
            </div>
          </div>
        )}
      </div>

      {hasResult && (
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 pt-3 border-b justify-center border-slate-100">
          {chartData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: entry.color }}
              />
              <span className="text-[10px] font-mono text-slate-500">
                {entry.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {hasResult && (
        <button
          onClick={onDetailClick}
          className="mt-5 items-center justify-center text-xs font-medium text-slate-400 hover:text-slate-600 transition-all cursor-pointer group"
        >
          <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-slate-500 after:transition-all after:duration-300 group-hover:after:w-full py-0.5">
            Lihat Detail Scan
          </span>
        </button>
      )}
    </div>
  );
};

export default PieChartCard;

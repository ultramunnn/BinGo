import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { pieData } from "../../constants/dashboardData";

const PieChartCard = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col flex-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold tracking-tight text-slate-400 uppercase font-mono">Klasifikasi Sampah</h2>
        <span className="text-[10px] font-mono text-slate-400">Hasil AI</span>
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
  );
};

export default PieChartCard;

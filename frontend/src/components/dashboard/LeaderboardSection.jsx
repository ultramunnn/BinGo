import React from "react";
import AvatarWithFallback from "./AvatarWithFallback";

const PodiumPillar = ({ item, type }) => {
  const isRank1 = item.rank === 1;
  const isBeach = type === 'beach';
  const heights = { 1: 'h-16 lg:h-36', 2: 'h-14 lg:h-28', 3: 'h-12 lg:h-20' };
  const pillarHeight = heights[item.rank];

  return (
    <div className="flex flex-col items-center flex-1 max-w-16 lg:max-w-32">
      <div className={`flex flex-col items-center mb-1.5 lg:mb-3 ${isRank1 ? 'h-16 lg:h-28' : 'h-14 lg:h-24'}`}>
        {!isBeach && (
          <div className={`relative ${isRank1 ? 'scale-100 lg:scale-110' : ''}`}>
            <AvatarWithFallback src={item.img} alt={item.name} size={isRank1 ? 'w-8 h-8 lg:w-14 lg:h-14' : 'w-7 h-7 lg:w-12 lg:h-12'} />
            <div className="absolute -top-1 -right-1 lg:-top-1.5 lg:-right-1.5 w-6 h-6 lg:w-8 lg:h-8">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 32 32">
                {Array.from({ length: 8 }).map((_, i) => {
                  const angle = i * 45;
                  const colors = {
                    1: { fill: '#fbbf24', stroke: '#f59e0b' },
                    2: { fill: '#94a3b8', stroke: '#64748b' },
                    3: { fill: '#fb923c', stroke: '#f97316' },
                  };
                  const c = colors[item.rank];
                  return (
                    <ellipse
                      key={i}
                      cx="16"
                      cy="6"
                      rx="3.5"
                      ry="6"
                      fill={c.fill}
                      fillOpacity="0.3"
                      stroke={c.stroke}
                      strokeWidth="0.5"
                      strokeOpacity="0.4"
                      transform={`rotate(${angle} 16 16)`}
                    />
                  );
                })}
              </svg>
              <div className={`absolute inset-0 m-auto w-3.5 h-3.5 lg:w-5 lg:h-5 rounded-full flex items-center justify-center text-[7px] lg:text-[9px] font-black text-white shadow-md z-10
                ${item.rank === 1 ? 'bg-amber-500' : item.rank === 2 ? 'bg-slate-500' : 'bg-orange-500'}`}>
                {item.rank}
              </div>
            </div>
          </div>
        )}
        {isBeach && (
          <div className="relative w-10 h-10 lg:w-18 lg:h-18 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 80">
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = i * 30;
                const colors = {
                  1: { fill: '#fbbf24', stroke: '#f59e0b' },
                  2: { fill: '#94a3b8', stroke: '#64748b' },
                  3: { fill: '#fb923c', stroke: '#f97316' },
                };
                const c = colors[item.rank];
                return (
                  <ellipse
                    key={i}
                    cx="40"
                    cy="16"
                    rx="7"
                    ry="14"
                    fill={c.fill}
                    fillOpacity="0.25"
                    stroke={c.stroke}
                    strokeWidth="0.8"
                    strokeOpacity="0.4"
                    transform={`rotate(${angle} 40 40)`}
                  />
                );
              })}
            </svg>
            <div className={`relative z-10 w-8 h-8 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-[8px] lg:text-sm font-black text-white shadow-md
              ${item.rank === 1 ? 'bg-amber-500' : item.rank === 2 ? 'bg-slate-500' : 'bg-orange-500'}`}>
              {item.rank}
            </div>
          </div>
        )}
        <div className="flex flex-col items-center mt-auto">
          <p className="text-[7px] lg:text-[10px] font-bold text-slate-700 truncate w-12 lg:w-20 text-center">{item.name}</p>
          <span className="text-[6px] lg:text-[8px] font-mono font-bold text-slate-500">{item.score}</span>
        </div>
      </div>

      {/* Neumorphic Plinth */}
      <div className="relative w-full">
        <div className="absolute inset-0 rounded-md lg:rounded-xl translate-x-0.75 translate-y-0.75" style={{ background: '#d2d2d6', filter: 'blur(6px)', opacity: 0.6 }} />
        <div
          className={`${pillarHeight} w-full rounded-md lg:rounded-xl relative overflow-hidden`}
          style={{
            background: 'linear-gradient(155deg, #f4f4f7 0%, #e6e6ea 40%, #d8d8dc 100%)',
            boxShadow: '8px 8px 18px #bcbcc0, -6px -6px 14px #ffffff, inset 2px 2px 4px rgba(255,255,255,0.85), inset -2px -2px 4px rgba(0,0,0,0.08)',
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-3 lg:h-4 rounded-t-md lg:rounded-t-xl" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.7), transparent)' }} />
          <div className="absolute top-0 left-0 bottom-0 w-1.5 lg:w-2 rounded-l-md lg:rounded-l-xl" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.5), transparent)' }} />
          <div className="absolute top-0 right-0 bottom-0 w-2 lg:w-3 rounded-r-md lg:rounded-r-xl" style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.07), transparent)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-3 lg:h-4 rounded-b-md lg:rounded-b-xl" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.08), transparent)' }} />
          <div className="absolute top-2 left-2 lg:top-3 lg:left-4 w-5 h-2 lg:w-8 lg:h-3 rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.5), transparent)' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-xl lg:text-5xl font-black select-none"
              style={{
                color: 'transparent',
                WebkitTextStroke: '1.5px rgba(0,0,0,0.06)',
                textShadow: '2px 2px 3px rgba(255,255,255,0.9), -1px -1px 2px rgba(0,0,0,0.07), 0 0 1px rgba(0,0,0,0.03)',
                filter: 'blur(0.2px)',
              }}
            >
              {item.rank}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeaderboardSection = ({ title, data, type, className = '' }) => {
  const podiumData = [data[1], data[0], data[2]];
  const listData = data.slice(3);
  const isBeach = type === 'beach';

  return (
    <div className={className}>
      <h3 className="text-[10px] lg:text-sm font-bold text-slate-600 mb-2 lg:mb-5 truncate">
        {title}
      </h3>

      {/* Podium */}
      <div className="flex items-end justify-center gap-0.5 lg:gap-2 pb-2 lg:pb-4">
        {podiumData.map((item) => (
          <PodiumPillar key={item.rank} item={item} type={type} />
        ))}
      </div>

      {/* List 4-10 */}
      <div className="mt-2 lg:mt-4 flex flex-col">
        {listData.map((item) => (
          <div key={item.rank} className="flex items-center gap-1.5 lg:gap-3 px-1.5 lg:px-3 py-0.5 lg:py-1.5">
            <span className="text-[8px] lg:text-[10px] font-mono font-bold text-slate-400 w-3 lg:w-4 text-center shrink-0">{item.rank}</span>
            <div className="w-4 h-4 lg:w-6 lg:h-6 shrink-0">
              {!isBeach && <AvatarWithFallback src={item.img} alt={item.name} size="w-4 h-4 lg:w-6 lg:h-6" />}
            </div>
            <p className="flex-1 text-[8px] lg:text-[11px] text-slate-600 truncate">{item.name}</p>
            <span className="text-[7px] lg:text-[9px] font-mono font-bold text-slate-400 shrink-0">{item.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardSection;

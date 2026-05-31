import React from "react";

const InitialsAvatar = ({ name, size = "w-8 h-8" }) => {
  if (!name || name === "Belum ada user" || name === "Belum ada pantai") {
    return (
      <div
        className={`${size} rounded-full bg-slate-200 flex items-center justify-center`}
      >
        <span className="text-slate-400 font-bold" style={{ fontSize: "10px" }}>
          ?
        </span>
      </div>
    );
  }
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
  const fontSize = size.includes("lg:w-14")
    ? "14px"
    : size.includes("lg:w-12")
      ? "11px"
      : "8px";
  return (
    <div
      className={`${size} rounded-full bg-linear-to-br from-indigo-400 to-indigo-600 flex items-center justify-center`}
    >
      <span className="text-white font-bold" style={{ fontSize }}>
        {initials || "?"}
      </span>
    </div>
  );
};

const Avatar = ({ src, name, size = "w-8 h-8", highlight = false }) => {
  const [imgError, setImgError] = React.useState(false);
  const borderClass = highlight ? "ring-2 ring-amber-400 ring-offset-1" : "";

  if (!src || imgError)
    return (
      <div>
        <InitialsAvatar name={name} size={size} />
      </div>
    );

  return (
    <div
      className={`${size} rounded-full overflow-hidden bg-slate-100 ${borderClass}`}
    >
      <img
        src={src}
        alt={name}
        className="w-full h-full object-cover"
        onError={() => setImgError(true)}
      />
    </div>
  );
};

const PodiumPillar = ({ item, type, isCurrentUser = false }) => {
  const isRank1 = item.rank === 1;
  const isEmpty =
    !item.name ||
    item.name === "Belum ada user" ||
    item.name === "Belum ada pantai";
  const heights = { 1: "h-16 lg:h-36", 2: "h-14 lg:h-28", 3: "h-12 lg:h-20" };
  const pillarHeight = heights[item.rank];

  const goldBg = isCurrentUser ? "from-amber-300 to-yellow-400" : "";
  const goldShadow = isCurrentUser ? "0 0 20px rgba(245,158,11,0.4)" : "";

  return (
    <div className="flex flex-col items-center flex-1 max-w-16 lg:max-w-32">
      <div
        className={`flex flex-col items-center mb-1.5 lg:mb-3 ${isRank1 ? "h-16 lg:h-28" : "h-14 lg:h-24"}`}
      >
        <div className={`relative ${isRank1 ? "scale-100 lg:scale-110" : ""}`}>
          <Avatar
            src={item.img}
            name={item.name}
            size={
              isRank1 ? "w-8 h-8 lg:w-14 lg:h-14" : "w-7 h-7 lg:w-12 lg:h-12"
            }
            highlight={isCurrentUser}
          />

          <div className="absolute -top-1 -right-1 lg:-top-1.5 lg:-right-1.5 w-6 h-6 lg:w-8 lg:h-8">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 32 32">
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = i * 45;
                const colors = {
                  1: {
                    fill: isCurrentUser ? "#fbbf24" : "#fbbf24",
                    stroke: isCurrentUser ? "#d97706" : "#f59e0b",
                  },
                  2: {
                    fill: isCurrentUser ? "#fbbf24" : "#94a3b8",
                    stroke: isCurrentUser ? "#d97706" : "#64748b",
                  },
                  3: {
                    fill: isCurrentUser ? "#fbbf24" : "#fb923c",
                    stroke: isCurrentUser ? "#d97706" : "#f97316",
                  },
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
                    fillOpacity="0.8"
                    stroke={c.stroke}
                    strokeWidth="0.5"
                    strokeOpacity="0.4"
                    transform={`rotate(${angle} 16 16)`}
                  />
                );
              })}
            </svg>
            <div
              className={`absolute inset-0 m-auto w-3.5 h-3.5 lg:w-5 lg:h-5 rounded-full flex items-center justify-center text-[7px] lg:text-[9px] font-black text-white shadow-md z-10
              ${isCurrentUser ? "bg-amber-500" : item.rank === 1 ? "bg-amber-500" : item.rank === 2 ? "bg-slate-500" : "bg-orange-500"}`}
            >
              {item.rank}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center mt-auto">
          <p
            className={`text-[7px] lg:text-[10px] font-bold truncate w-12 lg:w-20 text-center ${isEmpty ? "text-slate-300" : isCurrentUser ? "text-amber-700" : "text-slate-700"}`}
          >
            {item.name || "-"}
          </p>
          <span
            className={`text-[6px] lg:text-[8px] font-mono font-bold ${isEmpty ? "text-slate-200" : isCurrentUser ? "text-amber-600" : "text-slate-500"}`}
          >
            {item.score}
          </span>
        </div>
      </div>

      <div className="relative w-full">
        <div
          className="absolute inset-0 rounded-md lg:rounded-xl translate-x-0.75 translate-y-0.75"
          style={{
            background: isCurrentUser ? "#d97706" : "#d2d2d6",
            filter: "blur(6px)",
            opacity: isEmpty ? 0.2 : 0.6,
          }}
        />
        <div
          className={`${pillarHeight} w-full rounded-md lg:rounded-xl relative overflow-hidden`}
          style={{
            background: isEmpty
              ? "linear-gradient(155deg, #f8f8fa 0%, #f0f0f2 100%)"
              : isCurrentUser
                ? "linear-gradient(155deg, #fef3c7 0%, #fde68a 40%, #fbbf24 100%)"
                : "linear-gradient(155deg, #f4f4f7 0%, #e6e6ea 40%, #d8d8dc 100%)",
            boxShadow: isEmpty
              ? "4px 4px 10px #e0e0e4, -3px -3px 8px #ffffff"
              : isCurrentUser
                ? "0 0 20px rgba(245,158,11,0.3), 8px 8px 18px #bcbcc0, -6px -6px 14px #ffffff"
                : "8px 8px 18px #bcbcc0, -6px -6px 14px #ffffff, inset 2px 2px 4px rgba(255,255,255,0.85), inset -2px -2px 4px rgba(0,0,0,0.08)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-3 lg:h-4 rounded-t-md lg:rounded-t-xl"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.7), transparent)",
            }}
          />
          <div
            className="absolute top-0 left-0 bottom-0 w-1.5 lg:w-2 rounded-l-md lg:rounded-l-xl"
            style={{
              background:
                "linear-gradient(to right, rgba(255,255,255,0.5), transparent)",
            }}
          />
          <div
            className="absolute top-0 right-0 bottom-0 w-2 lg:w-3 rounded-r-md lg:rounded-r-xl"
            style={{
              background:
                "linear-gradient(to left, rgba(0,0,0,0.07), transparent)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-3 lg:h-4 rounded-b-md lg:rounded-b-xl"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.08), transparent)",
            }}
          />
          <div
            className="absolute top-2 left-2 lg:top-3 lg:left-4 w-5 h-2 lg:w-8 lg:h-3 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, rgba(255,255,255,0.5), transparent)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-xl lg:text-5xl font-black select-none"
              style={{
                color: "transparent",
                WebkitTextStroke: isEmpty
                  ? "1px rgba(0,0,0,0.03)"
                  : isCurrentUser
                    ? "2px rgba(217,119,6,0.2)"
                    : "1.5px rgba(0,0,0,0.06)",
                textShadow:
                  "2px 2px 3px rgba(255,255,255,0.9), -1px -1px 2px rgba(0,0,0,0.07), 0 0 1px rgba(0,0,0,0.03)",
                filter: "blur(0.2px)",
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

const CurrentUserFloating = ({ rank, name, score }) => (
  <div className="absolute top-[94%] lg:top-[95%] left-0 right-0 z-30 pb-1 px-1.5 lg:px-3">
    <div className="relative flex items-center gap-1.5 lg:gap-3 lg:py-1.5 pr-3.5 lg:pr-6 transition-colors">
      <div className="absolute inset-y-0 -left-3.5 lg:-left-5 -right-1.5 lg:-right-3 bg-linear-to-r from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-300 shadow-lg -z-10" />
      
      <div className="absolute inset-y-0 -left-3.5 lg:-left-5 -right-1.5 lg:-right-3 bg-linear-to-r from-amber-400 to-yellow-500 rounded-xl blur-sm opacity-30 -z-20" />

      <span className="absolute -left-3 lg:-left-4 text-amber-500 text-[8px] lg:text-[10px]">
        ⭐
      </span>

      <span className="text-[8px] lg:text-[10px] font-mono font-bold w-3 lg:w-4 text-center shrink-0 text-amber-700">
        {rank}
      </span>

      <div className="w-4 h-4 lg:w-6 lg:h-6 shrink-0">
        <div className="w-full h-full rounded-full bg-linear-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
          <span className="text-white font-bold text-[7px] lg:text-[9px]">
            {name
              ? name
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w.charAt(0).toUpperCase())
                  .join("")
              : "?"}
          </span>
        </div>
      </div>

      <p className="flex-1 text-[8px] lg:text-[11px] font-bold text-amber-800 truncate">
        {name}
      </p>

      <span className="text-[7px] lg:text-[9px] font-mono font-bold shrink-0 text-amber-600">
        {score}
      </span>
    </div>
  </div>
);

const LeaderboardSection = ({
  title,
  data,
  type,
  loading = false,
  currentUser = null,
  userName = "",
  className = "",
}) => {
  if (loading) {
    return (
      <div className={className}>
        <h3 className="text-[10px] lg:text-sm font-bold text-slate-600 mb-2 lg:mb-5 truncate">
          {title}
        </h3>
        <div className="flex items-end justify-center gap-2 pb-4">
          {[2, 1, 3].map((rank) => (
            <div
              key={rank}
              className="flex flex-col items-center flex-1 max-w-32 animate-pulse"
            >
              <div className="flex flex-col items-center mb-3 h-24">
                <div
                  className={`rounded-full bg-slate-200 ${rank === 1 ? "w-14 h-14" : "w-12 h-12"}`}
                />
                <div className="mt-2 h-3 bg-slate-200 rounded w-16" />
                <div className="mt-1 h-2 bg-slate-200 rounded w-10" />
              </div>
              <div
                className={`${rank === 1 ? "h-36" : rank === 2 ? "h-28" : "h-20"} w-full rounded-xl bg-slate-200`}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-1.5 animate-pulse"
            >
              <div className="w-4 h-3 bg-slate-200 rounded" />
              <div className="w-6 h-6 rounded-full bg-slate-200" />
              <div className="flex-1 h-3 bg-slate-200 rounded w-20" />
              <div className="h-3 bg-slate-200 rounded w-10" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  const isUser = type === "user";
  const userRank = currentUser?.rank || 0;
  const userInTop10 = userRank > 0 && userRank <= 10;
  const userInTop3 = userRank > 0 && userRank <= 3;
  const userOutsideTop10 = userRank > 10;

  const podiumData = [data[1], data[0], data[2]].filter(Boolean);
  const listData = data.slice(3);

  return (
    <div className={`${className} relative`}>
      <h3 className="text-[10px] lg:text-sm font-bold text-slate-600 mb-2 lg:mb-5 truncate">
        {title}
      </h3>

      <div className="flex items-end justify-center gap-0.5 lg:gap-2 pb-2 lg:pb-4">
        {podiumData.map((item) => (
          <PodiumPillar
            key={item.rank}
            item={item}
            type={type}
            isCurrentUser={isUser && userInTop3 && item.rank === userRank}
          />
        ))}
      </div>

      <div className="mt-2 lg:mt-4 flex flex-col">
        {listData.map((item) => {
          const isEmpty =
            !item.name ||
            item.name === "Belum ada user" ||
            item.name === "Belum ada pantai";
          const isCurrentUserItem =
            isUser && userInTop10 && item.rank === userRank;

          return (
            <div
              key={item.rank}
              className={`flex items-center gap-1.5 lg:gap-3 py-0.5 lg:py-1.5 rounded-lg transition-colors relative
          ${
            isCurrentUserItem
              ? "bg-amber-50 border border-amber-200 pl-5 lg:pl-8 -ml-3.5 lg:-ml-5 pr-1.5 lg:pr-3"
              : "px-1.5 lg:px-3 " + (isEmpty ? "opacity-40" : "")
          }`}
            >
              {isCurrentUserItem && (
                <span className="absolute left-1.5 lg:left-3 text-amber-500 text-[8px] lg:text-[10px]">
                  ⭐
                </span>
              )}

              <span
                className={`text-[8px] lg:text-[10px] font-mono font-bold w-3 lg:w-4 text-center shrink-0
          ${isCurrentUserItem ? "text-amber-700" : "text-slate-400"}`}
              >
                {item.rank}
              </span>
              <div className="w-4 h-4 lg:w-6 lg:h-6 shrink-0">
                <Avatar
                  src={item.img}
                  name={item.name}
                  size="w-4 h-4 lg:w-6 lg:h-6"
                  highlight={isCurrentUserItem}
                />
              </div>
              <p
                className={`flex-1 text-[8px] lg:text-[11px] truncate
          ${isCurrentUserItem ? "font-bold text-amber-800" : "text-slate-600"}`}
              >
                {item.name || "-"}
              </p>
              <span
                className={`text-[7px] lg:text-[9px] font-mono font-bold shrink-0
          ${isCurrentUserItem ? "text-amber-600" : "text-slate-400"}`}
              >
                {item.score}
              </span>
            </div>
          );
        })}
      </div>

      {isUser && userOutsideTop10 && currentUser && (
        <CurrentUserFloating
          rank={userRank}
          name={userName || "Kamu"}
          score={`${currentUser.scan_count} scan`}
        />
      )}
    </div>
  );
};

export default LeaderboardSection;

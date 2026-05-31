import React, { useState } from "react";

const AvatarWithFallback = ({
  src,
  alt,
  size = "w-14 h-14",
  type = "user",
}) => {
  const [imgError, setImgError] = useState(false);

  if (!src || imgError) {
    return (
      <div
        className={`${size} rounded-full bg-slate-300 flex items-center justify-center ring-2 ring-[#e8e8ec] shadow-md shrink-0`}
      >
        {type === "beach" ? (
          <svg
            className="w-4 h-4 text-slate-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M17 21H7a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5 5 5 0 0 1 5-5 5 5 0 0 1 5 5h2a3 3 0 0 1 3 3v8a5 5 0 0 1-5 5z" />
            <path d="M7 21v-2" />
            <path d="M17 21v-2" />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 text-slate-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setImgError(true)}
      className={`${size} rounded-full object-cover ring-2 ring-[#e8e8ec] shadow-md shrink-0`}
    />
  );
};

export default AvatarWithFallback;

import React, { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ChevronLeft,
  Grid,
  RotateCcw,
  Image as ImageIcon,
  Recycle,
} from "lucide-react";

const Usage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001,
  });

  const bottleY = useTransform(
    smoothProgress,
    [0, 0.06, 0.48, 0.54],
    [-580, 0, 0, -580],
  );
  const phoneY = useTransform(smoothProgress, [0, 0.06], [650, 0]);

  // ── Text 1: muncul pertama, stay ──
  const textX = useTransform(smoothProgress, [0, 0.08], [-315, 0]);
  const textOpacity = useTransform(smoothProgress, [0, 0.08], [0, 1]);

  // ── Scan phase (setelah text 1) ──
  const cornerSize = useTransform(
    smoothProgress,
    [0.1, 0.14, 0.2, 0.24],
    [0, 1, 1, 0],
  );
  const scanOpacity = useTransform(
    smoothProgress,
    [0.1, 0.14, 0.2, 0.24],
    [0, 1, 1, 0],
  );
  const laserTop = useTransform(smoothProgress, [0.14, 0.22], ["0%", "100%"]);
  const scanHeight = useTransform(smoothProgress, [0.14, 0.22], ["0%", "100%"]);

  const text2X = useTransform(smoothProgress, [0.18, 0.26], [-300, 1]);
  const text2Opacity = useTransform(smoothProgress, [0.18, 0.26], [0, 1]);

  const objectOpacity = useTransform(
    smoothProgress,
    [0.28, 0.34, 0.52, 0.56],
    [0, 1, 1, 0],
  );
  const confidenceOpacity = useTransform(
    smoothProgress,
    [0.34, 0.4, 0.52, 0.56],
    [0, 1, 1, 0],
  );
  const recycleOpacity = useTransform(
    smoothProgress,
    [0.4, 0.46, 0.52, 0.56],
    [0, 1, 1, 0],
  );

  const text3X = useTransform(smoothProgress, [0.44, 0.52], [300, 0]);
  const text3Opacity = useTransform(smoothProgress, [0.44, 0.52], [0, 1]);

  const cardResultAIX = useTransform(
    smoothProgress,
    [0.54, 0.6, 0.68, 0.72],
    [300, 0, 0, -300],
  );
  const buttonResultAIX = useTransform(smoothProgress, [0.54, 0.6], [300, 0]);

  const text4X = useTransform(smoothProgress, [0.68, 0.76], [400, 0]);
  const text4Opacity = useTransform(smoothProgress, [0.68, 0.76], [0, 1]);

  const cardMapX = useTransform(smoothProgress, [0.78, 0.84], [300, 0]);

  const progressBar = useTransform(smoothProgress, [0.1, 1], ["0%", "100%"]);
  const statusText = useTransform(
    smoothProgress,
    [0, 0.1, 0.22, 0.54, 0.88, 1],
    [
      "...",
      "Memindai Objek...",
      "Menganalisis Data...",
      "Menganalisis Data...",
      "Lokasi Ditemukan!",
      "Selesai",
    ],
  );
  const headerText = useTransform(
    smoothProgress,
    [0, 0.1, 0.54, 0.84, 1],
    ["...", "Memindai", "Memindai", "Analisis Hasil", "Temukan Lokasi"],
  );

  const buttonCameraX = useTransform(
    smoothProgress,
    [0, 0.04, 0.48, 0.54],
    [-300, 0, 0, -300],
  );

  return (
    <section
      id="usage"
      ref={containerRef}
      className="relative h-[1800vh] bg-white font-sans antialiased"
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* 1. TULISAN — chapter marker */}
        {/* Mobile: fade only, di samping handphone */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="absolute top-[15%] left-[5%] max-w-28 z-20 text-left md:hidden"
        >
          <p className="text-[10px] font-medium leading-tight text-slate-800">
            1) Memindai sampah untuk validasi material
          </p>
        </motion.div>
        <motion.div
          style={{ opacity: text2Opacity }}
          className="absolute top-[30%] left-[5%] max-w-28 z-20 text-left md:hidden"
        >
          <p className="text-[10px] font-medium leading-tight text-slate-800">
            2) Hasil sampah terungkap dengan garis kurva
          </p>
        </motion.div>
        <motion.div
          style={{ opacity: text3Opacity }}
          className="absolute top-[50%] right-[5%] max-w-28 z-20 text-right md:hidden"
        >
          <p className="text-[10px] font-medium leading-tight text-slate-800">
            3) Hasil daur ulang dan rekomendasi
          </p>
        </motion.div>
        <motion.div
          style={{ opacity: text4Opacity }}
          className="absolute top-[70%] right-[5%] max-w-28 z-20 text-right md:hidden"
        >
          <p className="text-[10px] font-medium leading-tight text-slate-800">
            4) Review pantai berdasarkan rating
          </p>
        </motion.div>

        {/* Desktop: slide + fade, positioned at corners */}
        <motion.div
          style={{ x: textX, opacity: textOpacity }}
          className="absolute top-28 left-30 max-w-50 z-20 hidden md:block"
        >
          <p className="text-[14px] font-medium leading-tight text-slate-800">
            1) <br /> Memindai sampah untuk validasi material
          </p>
        </motion.div>
        <motion.div
          style={{ x: text2X, opacity: text2Opacity }}
          className="absolute top-[40%] left-16 max-w-50 z-20 hidden md:block"
        >
          <p className="text-[14px] font-medium leading-tight text-slate-800">
            2) <br /> Hasil sampah terungkap dengan garis kurva
          </p>
        </motion.div>
        <motion.div
          style={{ x: text3X, opacity: text3Opacity }}
          className="absolute top-[50%] right-16 max-w-50 z-20 hidden md:block"
        >
          <p className="text-[14px] font-medium leading-tight text-slate-800">
            3) <br /> Hasil sampah apakah dapat di daur ulang, dan rekomendasi
            perlakuan daur ulang sampah
          </p>
        </motion.div>
        <motion.div
          style={{ x: text4X, opacity: text4Opacity }}
          className="absolute top-[70%] right-50 max-w-50 z-20 hidden md:block"
        >
          <p className="text-[14px] font-medium leading-tight text-slate-800">
            4) <br /> Review pantai untuk berdasarkan rating pengguna
          </p>
        </motion.div>

        {/* BOTOL */}
        <motion.div
          style={{ y: bottleY }}
          className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none"
        >
          <img
            src="assets/images/botol-scan.png"
            className="w-[80%] md:w-[60%] max-w-5xl"
            alt="bg-bottle"
          />
        </motion.div>

        <div className="absolute inset-0 z-30 pointer-events-none hidden md:block">
          <motion.div
            style={{ opacity: objectOpacity }}
            className="absolute right-[55%] top-[45%] flex items-center"
          >
            <div className="flex flex-col items-end mr-2">
              <span className="text-black/40 text-[10px] font-medium uppercase tracking-widest leading-none">
                Objek
              </span>
              <h2 className="text-xl font-semibold text-black whitespace-nowrap leading-tight">
                Botol Plastik
              </h2>
            </div>
            <svg
              width="200"
              height="60"
              viewBox="0 0 200 60"
              fill="none"
              className="overflow-visible"
            >
              <path
                d="M5 10 H160 L190 50"
                stroke="black"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="5" cy="10" r="4" fill="black" />
              <circle cx="190" cy="50" r="8" fill="black" fillOpacity="0.2" />
              <circle cx="190" cy="50" r="4" fill="black" />
            </svg>
          </motion.div>

          <motion.div
            style={{ opacity: confidenceOpacity }}
            className="absolute left-[50%] translate-x-25 top-[35%] flex items-center"
          >
            <svg
              width="200"
              height="60"
              viewBox="0 0 200 60"
              fill="none"
              className="overflow-visible"
            >
              <path
                d="M10 50 L40 10 H190"
                stroke="black"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="10" cy="50" r="8" fill="black" fillOpacity="0.2" />
              <circle cx="10" cy="50" r="4" fill="black" />
              <circle cx="190" cy="10" r="4" fill="black" />
            </svg>
            <div className="flex flex-col items-start ml-2">
              <span className="text-black/40 text-[10px] font-medium uppercase tracking-widest leading-none">
                Kepercayaan
              </span>
              <h2 className="text-xl font-semibold text-black whitespace-nowrap leading-tight">
                98.2%
              </h2>
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: recycleOpacity }}
            className="absolute left-[50%] translate-x-25 top-[50%] flex items-center"
          >
            <svg
              width="200"
              height="60"
              viewBox="0 0 200 60"
              fill="none"
              className="overflow-visible"
            >
              <path
                d="M10 50 L40 10 H190"
                stroke="black"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="10" cy="50" r="8" fill="black" fillOpacity="0.2" />
              <circle cx="10" cy="50" r="4" fill="black" />
              <circle cx="190" cy="10" r="4" fill="black" />
            </svg>
            <div className="flex flex-col items-start ml-2">
              <span className="text-black/40 text-[10px] font-medium uppercase tracking-widest leading-none">
                Daur Ulang
              </span>
              <h2 className="text-xl font-semibold text-black whitespace-nowrap leading-tight">
                Ya
              </h2>
            </div>
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: objectOpacity }}
          className="absolute left-[8%] top-[45%] z-30 flex flex-col items-end md:hidden pointer-events-none"
        >
          <span className="text-[8px] text-black/40 font-medium uppercase tracking-wider">
            Objek
          </span>
          <span className="text-[11px] font-semibold text-black">
            Botol Plastik
          </span>
        </motion.div>
        <motion.div
          style={{ opacity: confidenceOpacity }}
          className="absolute right-[8%] top-[35%] z-30 flex flex-col items-start md:hidden pointer-events-none"
        >
          <span className="text-[8px] text-black/40 font-medium uppercase tracking-wider">
            Kepercayaan
          </span>
          <span className="text-[11px] font-semibold text-black">98.2%</span>
        </motion.div>
        <motion.div
          style={{ opacity: recycleOpacity }}
          className="absolute right-[8%] top-[55%] z-30 flex flex-col items-start md:hidden pointer-events-none"
        >
          <span className="text-[8px] text-black/40 font-medium uppercase tracking-wider">
            Daur Ulang
          </span>
          <span className="text-[11px] font-semibold text-black">Ya</span>
        </motion.div>

        <motion.div
          style={{ y: phoneY }}
          className="relative z-10 scale-[0.7] sm:scale-[0.85] md:scale-100 origin-center"
        >
          <div className="w-[280px] h-[550px] top-8 rounded-[3.5rem] border-[10px] border-black shadow-[0_40px_80px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col relative bg-transparent">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-b-2xl z-50"></div>

            <div className="flex-1 relative flex flex-col z-10">
              <div className="pt-8 px-6 pb-2 flex justify-between items-center bg-white">
                <ChevronLeft size={20} className="text-slate-800" />
                <motion.span className="text-[14px] font-bold text-slate-800">
                  {headerText}
                </motion.span>
                <Grid size={18} className="text-slate-800" />
              </div>

              <div className="bg-white px-8 py-2 flex flex-col items-center">
                <div className="w-full bg-white bg-opacity h-2 overflow-hidden border border-black">
                  <motion.div
                    style={{ width: progressBar }}
                    className="bg-slate-900 h-full"
                  />
                </div>
                <motion.p className="text-center text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">
                  {statusText}
                </motion.p>
              </div>

              <div className="flex-1 px-4 py-4 relative">
                <motion.div
                  style={{ opacity: cornerSize }}
                  className="absolute inset-4 z-10 pointer-events-none opacity-50"
                >
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-[3px] border-l-[3px] border-black"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-[3px] border-r-[3px] border-black"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-[3px] border-l-[3px] border-black"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-[3px] border-r-[3px] border-black"></div>
                </motion.div>

                <div className="w-full h-full relative bg-transparent border border-white/20 overflow-hidden">
                  <div className="w-full h-full grid grid-cols-1 items-center justify-items-stretch">
                    <motion.div
                      style={{ x: cardResultAIX, gridArea: "1 / 1" }}
                      className="w-full h-full relative bg-white border border-white overflow-hidden"
                    >
                      <div className="absolute inset-0 flex flex-col p-6 animate-in fade-in duration-700">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
                            Hasil Ditemukan
                          </h3>
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-50 flex flex-col border border-slate-100 rounded-2xl p-4 shadow-sm">
                              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mb-2">
                                Material
                              </p>
                              <div className="flex flex-col">
                                <h4 className="text-base font-semibold text-slate-800">
                                  Plastik PET
                                </h4>
                              </div>
                            </div>

                            <div className="bg-slate-50 flex flex-col items-center justify-center border border-slate-100 rounded-2xl shadow-sm">
                              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mb-2">
                                Daur Ulang
                              </span>
                              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-green-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2.5"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mt-4 mb-0.5">
                            Rekomendasi AI
                          </p>
                          <p className="text-[11px] leading-relaxed text-slate-600 font-medium">
                            Botol PET ini bernilai tinggi.{" "}
                            <span className="text-slate-900 font-bold">
                              Bilas bersih
                            </span>
                            , lepaskan label plastik, dan remas untuk menghemat
                            ruang di bin daur ulang.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      style={{ x: cardMapX, gridArea: "1 / 1" }}
                      className="w-full h-full relative bg-white border border-white overflow-hidden"
                    >
                      <div className="absolute inset-0 flex flex-col p-5 animate-in fade-in duration-700">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-slate-800 leading-none">
                              Pantai Teluk Asmara
                            </h3>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mt-1">
                              Malang, Indonesia
                            </p>
                          </div>
                          <div className="bg-yellow-100 px-2 py-1 rounded-lg flex items-center gap-1">
                            <span className="text-[12px] font-bold text-yellow-700">
                              4.8
                            </span>
                            <svg
                              className="w-3 h-3 text-yellow-500 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        </div>

                        <div className="relative flex-1 w-full overflow-hidden rounded-2xl border border-slate-100 shadow-inner bg-slate-50 mb-3 group">
                          <img
                            src="assets/images/maps.png"
                            alt="Beach Map"
                            className="w-full h-full object-cover grayscale-[20%]"
                          />

                          <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 active:scale-95">
                            <div className="relative">
                              <div className="absolute -inset-2 bg-blue-400/30 rounded-full animate-ping" />
                              <div className="p-2 rounded-full shadow-lg relative">
                                <svg
                                  className="w-5 h-5 text-red-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2.5"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2.5"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                              </div>
                            </div>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wide leading-none">
                              Total Pindai
                            </p>
                            <p className="text-lg font-bold text-slate-800">
                              1.240{" "}
                              <span className="text-[10px] font-normal">
                                pcs
                              </span>
                            </p>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wide leading-none">
                              Tingkat Kebersihan
                            </p>
                            <p className="text-lg font-bold text-green-600">
                              Baik
                            </p>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500 font-medium leading-tight">
                          Rating berdasarkan{" "}
                          <span className="text-slate-900 font-bold">
                            150+ user
                          </span>
                          . Klik icon map untuk detail laporan kebersihan pantai
                          ini.
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    style={{ opacity: scanOpacity }}
                    className="absolute inset-0 z-20"
                  >
                    <motion.div
                      style={{
                        height: scanHeight,
                        backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.15) 1px, transparent 1px)`,
                        backgroundSize: "16px 16px",
                      }}
                      className="absolute top-0 left-0 w-full bg-slate-900/5 backdrop-blur-[1px]"
                    />
                    <motion.div
                      style={{ top: laserTop }}
                      className="absolute left-0 w-full h-[3px] bg-slate-900 z-30"
                      animate={{
                        boxShadow: [
                          "0 0 8px 2px rgba(15, 23, 42, 0.4)",
                          "0 0 20px 6px rgba(15, 23, 42, 0.6)",
                          "0 0 8px 2px rgba(15, 23, 42, 0.4)",
                        ],
                        opacity: [1, 0.5, 1, 0.8, 1],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: "mirror",
                      }}
                    />
                  </motion.div>
                </div>
              </div>

              <div className="p-5 pb-8 bg-white border-t border-slate-50">
                <div className="grid grid-cols-1 items-center justify-items-stretch">
                  <motion.div
                    style={{ x: buttonCameraX, gridArea: "1 / 1" }}
                    className="bg-slate-900 rounded-[1.5rem] p-3 flex items-center justify-between shadow-inner"
                  >
                    <button className="text-[10px] font-medium text-white/70 px-2 uppercase tracking-wide">
                      Batal
                    </button>
                    <RotateCcw size={18} className="text-white/60" />
                    <div className="w-12 h-12 bg-white/20 rounded-full border-[3px] border-white shadow-lg flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full border border-white/20"></div>
                    </div>
                    <ImageIcon size={18} className="text-white/60" />
                    <button className="text-[10px] font-medium text-white/70 px-2 uppercase tracking-wide">
                      Selesai
                    </button>
                  </motion.div>

                  <motion.div
                    style={{ x: buttonResultAIX, gridArea: "1 / 1" }}
                    className="bg-slate-900 rounded-[1.5rem] p-3 flex items-center justify-center shadow-inner"
                  >
                    <span className="text-white font-bold text-sm">
                      Selesai
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Usage;

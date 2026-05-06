import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  // Animasi untuk parent agar child muncul berurutan
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      className="relative h-screen w-full flex items-center justify-center bg-[#D9D9D9] overflow-hidden snap-start"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background Text - Parallax Effect (sedikit bergerak saat scroll) */}
      <motion.div
        className="absolute inset-0 flex top-0 justify-center pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2 }}
      >
        <h1 className="text-[10rem] font-black text-black/30 tracking-wider leading-none select-none">
          LOREM IPSUM
        </h1>
      </motion.div>

      {/* Wrapper Gambar Utama */}
      <div className="relative z-20 flex flex-col items-center justify-center mb-24">
        <motion.div
          variants={itemVariants}
          className="relative w-[520px] left-2 z-10"
        >
          <img
            src="/assets/images/hp-scan.png"
            alt="Hand holding phone"
            className="w-full h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500"
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="absolute top-[45%] left-2 w-[500px] z-30"
        >
          <img
            src="/assets/images/botol.png"
            alt="Plastic bottles"
            className="w-full h-auto"
          />
        </motion.div>
      </div>

      {/* Callout Kiri */}
      <motion.div
        variants={itemVariants}
        className="absolute left-[21%] top-[50%] z-40 hidden md:block"
      >
        <div className="relative">
          <svg
            width="450"
            height="100"
            viewBox="0 0 450 100"
            fill="none"
            className="absolute -top-10 left-0 pointer-events-none"
          >
            <path
              d="M0 10 H380 L420 70"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="420" cy="70" r="8" fill="white" fillOpacity="0.5" />
            <circle cx="420" cy="70" r="4" fill="white" />
          </svg>
          <div className="flex flex-col">
            <span className="text-gray-500 text-lg font-medium mb-1 ml-6">
              Lorem Pisum I
            </span>
            <div className="flex items-center gap-4 ml-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#38bdf8] to-[#0ea5e9] flex items-center justify-center shadow-lg border border-white/20">
                {/* Icon SVG kamu di sini */}
              </div>
              <h2 className="text-3xl font-bold text-black tracking-tight">
                Lorem
              </h2>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Callout Kanan (Sama seperti kiri, bungkus dengan motion.div) */}
      <motion.div
        variants={itemVariants}
        className="absolute right-8 top-[45%] z-50 flex flex-col items-end"
      >
        <div className="flex flex-col items-end mr-6 mb-1">
          <span className="text-gray-500 text-lg font-medium mb-1">
            Lorem Pisum loe
          </span>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#38bdf8] to-[#0ea5e9] flex items-center justify-center shadow-lg border border-white/20">
              <svg
                className="w-7 h-7 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-black tracking-tight">
              Lorem
            </h2>
          </div>
        </div>

        <div className="relative w-[500px] h-[100px] pointer-events-none">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 500 100"
            fill="none"
            className="overflow-visible"
          >
            <path
              d="M500 0 H120 L40 80"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            <circle cx="40" cy="80" r="8" fill="white" fillOpacity="0.5" />
            <circle cx="40" cy="80" r="4" fill="white" />
          </svg>
        </div>
      </motion.div>

      {/* Pasir - Animasi dari bawah */}
      <motion.div
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute bottom-0 scale-90 left-28 w-full z-50 pointer-events-none"
      >
        <img
          src="/assets/images/pasir.png"
          alt="Sand"
          className="w-250 h-auto translate-y-4 object-bottom"
        />
      </motion.div>
    </motion.section>
  );
};

export default Hero;

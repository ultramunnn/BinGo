import React from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden font-sans bg-black">
<<<<<<< HEAD
      
=======
      {/* --- VIDEO BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline // Penting agar video otomatis jalan di iPhone/Safari
          className="w-full h-full object-cover opacity-80" // object-cover bikin video full screen tanpa gepeng
        >
          <source src="/assets/videos/hero.mp4" type="video/mp4" />
          Browser kamu tidak mendukung tag video.
        </video>
        {/* Overlay Atas (untuk kontras navbar & teks) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent h-1/2"></div>

        {/* Overlay Bawah (untuk blending ke putih solid) */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-white via-white/80 to-transparent bottom-[-1px]"></div>
      </div>

      {/* --- CONTENT --- */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-white text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] max-w-5xl drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
        >
          SELAMATKAN LAUTAN. <br />
          JADILAH PERUBAHAN.
        </motion.h1>
      </div>
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
    </section>
  );
};

export default Hero;

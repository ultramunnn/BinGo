import React from "react";
import { motion } from "framer-motion"; // Jika Anda ingin menambahkan animasi Framer Motion

const Quotes = () => {
  return (
    <section id="quotes" className="relative w-full bg-black min-h-screen flex items-center justify-center py-20 px-6 md:px-10 overflow-hidden">
      <div className="flex flex-col items-center justify-center text-center max-w-5xl mx-auto">
        <h1 className="text-7xl md:text-8xl lg:text-9xl font-black font-sans tracking-tight leading-none mb-8">
          <span className="block text-masked-ocean">Pilah hari ini,</span>
          <span className="block text-masked-ocean">lestari</span>
          <span className="block text-masked-ocean">selamanya.</span>
        </h1>

        <p className="text-base md:text-lg text-gray-400 font-sans mt-4 max-w-lg mx-auto">
          Setiap sampah yang terpilah adalah nafas baru bagi lautan.
        </p>
      </div>
    </section>
  );
};

export default Quotes;

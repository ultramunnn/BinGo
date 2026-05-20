import React from "react";
import { motion } from "framer-motion";

const CTA = () => {
  return (
    // Gunakan h-screen agar section tepat setinggi layar monitor
    <section className="relative w-full h-screen bg-white overflow-hidden flex items-center">
      <div className="container mx-auto px-6 md:px-20 h-full flex flex-col md:flex-row items-center justify-between">
        
        {/* Sisi Kiri: Image Hands (Dibuat Raksasa) */}
        <motion.div 
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          // h-full supaya container pembungkus gambar setinggi layar
          className="w-full md:w-[60%] h-full flex items-center justify-start right-[7%] relative"
        >
          <img 
            src="/assets/images/hand-trash.png" 
            alt="Identifikasi Sampah" 
            /**
             * h-full: membuat tinggi gambar 100% dari section (raksasa)
             * w-auto: menjaga proporsi agar tangan tidak gepeng
             * max-w-none: menghilangkan batasan lebar default
             * scale-110: sedikit pembesaran agar ujung tangan terlihat "keluar" dari layar (opsional)
             */
            className="h-full w-auto max-w-none object-contain transform -scale-x-100 md:scale-x-100 scale-110 origin-center" 
          />
        </motion.div>

        {/* Sisi Kanan: Konten Teks */}
        <div className="w-full md:w-[40%] flex flex-col items-center md:items-end text-center md:text-right z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            // Ukuran teks diperbesar (text-7xl/8xl) agar seimbang dengan gambar raksasanya
            className="text-6xl font-medium text-black leading-[1.1] max-w-2xl"
          >
            Identifikasi <br />
            Sampah dalam <br />
            Genggaman Anda.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <button className="bg-black text-white px-12 py-5 rounded-2xl text-xl font-black hover:bg-gray-900 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.15)] active:scale-95">
              Mulai Sekarang
            </button>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default CTA;
import React from "react";
import { motion } from "framer-motion";

import underwaterImage from "/assets/images/Underwater.png";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Mission = () => {
  return (
    <>
      <section className="bg-black text-white py-12 sm:py-20 px-6 sm:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12">
          <motion.div
            className="md:w-1/2"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={0}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-4 sm:mb-8">
              Misi BinGo <br />
            </h2>
            <span className="text-[#F2C94C] text-3xl sm:text-4xl lg:text-5xl font-serif font-bold">
              Pilah sampah pintar berbasis AI jadi lebih mudah
            </span>
            <p className="mt-6 sm:mt-8 text-sm sm:text-base font-sans max-w-full text-gray-400">
              Kami memulai dengan membangun klasifikasi gambar pintar untuk
              membantu pengguna mengidentifikasi dan memisahkan sampah organik
              dan anorganik secara instan.
            </p>
          </motion.div>

          <motion.div
            className="md:w-1/2 flex flex-col justify-between"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={1}
          >
            <p className="text-sm sm:text-base font-sans mb-4 sm:mb-6 max-w-full">
              BinGo menjembatani teknologi dan ekologi lewat dua metode pintar:
              klasifikasi gambar otomatis. Kami membuat manajemen sampah jadi
              interaktif, mudah diakses, dan berdampak bagi semua orang.
            </p>
            <div className="relative w-full h-40 sm:h-48 rounded-lg overflow-hidden my-4">
              <img
                src={underwaterImage}
                alt="Underwater ecosystem"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <p className="text-sm sm:text-base mt-4 sm:mt-6 max-w-full">
              Kami berpikir lebih besar untuk membangun ekosistem berkelanjutan
              demi masa depan yang lebih bersih.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Mission;

import React from "react";
import { motion } from "framer-motion";

const Impact = () => {
  const features = [
    {
      title: "Identifikasi sampah",
      img: "/assets/images/icon-bottle.svg",
    },
    {
      title: "Memutus Rantai Mikroplastik",
      img: "/assets/images/icon-chain.svg",
    },
    {
      title: "Efisiensi untuk Relawan",
      img: "/assets/images/icon-peoples.svg",
    },
  ];

  return (
    <section className="relative w-full min-h-screen bg-white flex flex-col md:flex-row overflow-hidden">
      {/* Sisi Kiri: Konten Teks */}
      <div className="w-full md:w-[55%] flex flex-col justify-center px-8 md:px-20 py-20 z-10">
        <motion.h2
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-semibold leading-tight text-gray-900 mb-20"
        >
          Bersama <span className="text-[#4BAFBC]">BinGo</span>, Kita <br />
          Jaga Setiap Inci <br />
          Pesisir.
        </motion.h2>

        <div className="grid grid-cols-3 gap-4 text-center">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <div className="mb-4 h-20 flex items-center justify-center">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <p className="text-sm md:text-base font-bold text-gray-800 leading-snug">
                {item.title}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="w-full md:w-1/2 relative h-[500px] -right-1 md:h-screen bg-white">
        <img
          src="assets/images/mask-beach.png"
          alt="Beach"
          // Kita pakai object-right agar bagian gambarnya mepet ke kanan layar
          // dan h-full untuk memastikan tingginya dari atas ke bawah
          className="w-full h-full object-cover object-right"
        />
      </div>
    </section>
  );
};

export default Impact;

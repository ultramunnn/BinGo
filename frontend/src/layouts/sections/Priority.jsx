import React from "react";
import { motion } from "framer-motion";

const Priority = () => {
  return (
    <section className="relative w-full min-h-screen bg-white flex flex-col items-center py-16 px-4 md:px-0 overflow-hidden">
      <div className="text-center mb-16 px-4">
        <h2 className="text-6xl font-extrabold font-serif text-gray-900 leading">
          Prioritas BinGo
        </h2>
        <p className="text-xl font-sans text-gray-500 mt-4">
          BinGo membantu mengelola, memilah, dan mendaur ulang sampah demi
          lingkungan yang lebih bersih.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-full mb-16 md:mb-24">
        <div className="md:w-1/2 p-8 md:pl-24 text-center md:text-left">
          <h3 className="text-6xl font-extrabold font-serif text-gray-900 leading-tight mb-6">
            {" "}
            Atasi Penumpukan
            <span className="relative inline-block">
              <span className="relative z-10 text-blue-700">
                Limbah Sekitar
              </span>{" "}
              <span className="absolute bottom-0 left-0 w-full h-2/5 bg-blue-100 opacity-80 rounded-md -rotate-1"></span>{" "}
            </span>
          </h3>
          <p className="text-lg font-sans text-gray-700 leading-relaxed max-w-md mx-auto md:mx-0">
            {" "}
            Sampah yang tidak terkelola dengan baik merusak ekosistem dan
            kesehatan manusia. BinGo memberikan panduan pembuangan yang tepat
            guna menekan polusi sampah di lingkungan kita.
          </p>
        </div>
        <div className="md:w-[55%] flex justify-end mt-8 md:mt-0 relative">
          {" "}
          <div className="relative w-[550px] h-[350px] overflow-hidden">
            {" "}
            <img
              src="/assets/images/Pantai-Image.png"
              alt="Ocean View"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row-reverse items-center justify-between w-full max-w-full mb-16 md:mb-24">
        <div className="md:w-1/2 p-8 md:pr-24 text-center md:text-left">
          {" "}
          <h3 className="text-6xl font-extrabold font-serif text-gray-900 leading-tight mb-6">
            Hapus
            <span className="relative inline-block">
              <span className="relative z-10 text-orange-600">Pencemaran</span>
              <span className="absolute bottom-0 left-0 w-full h-2/5 bg-orange-100 opacity-80 rounded-md -rotate-1"></span>
            </span>
            Limbah Pabrik
          </h3>
          <p className="text-lg font-sans text-gray-700 leading-relaxed max-w-md mx-auto md:mx-0">
            Pencemaran juga merugikan manusia. Mikroplastik karsinogenik telah
            masuk ke dalam rantai makanan, dan zat pencemar beracun menimbulkan
            bahaya kesehatan yang serius.
          </p>
        </div>
        <div className="md:w-[55%] flex justify-start mt-8 md:mt-0 relative -ml-4 md:-ml-0">
          <div className="relative w-full md:w-[550px] h-[350px] md:h-[450px]">
            <img
              src="/assets/images/Penyu-Image.png"
              alt="Underwater Life"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-full mb-16 md:mb-24">
        <div className="md:w-1/2 p-8 md:pl-24 text-center md:text-left">
          {" "}
          <h3 className="text-6xl font-extrabold font-serif text-gray-900 leading-tight mb-6">
            Wujudkan masa depan yang <br></br>
            <span className="relative inline-block">
              <span className="relative z-10 text-emerald-600">lestari</span>{" "}
              <span className="absolute bottom-0 left-0 w-full h-2/5 bg-emerald-100 opacity-80 rounded-md -rotate-1"></span>
            </span>
          </h3>
          <p className="text-lg font-sans text-gray-700 leading-relaxed max-w-md mx-auto md:mx-0">
            Setiap langkah kecil dalam memilah sampah bersama BinGo adalah
            kontribusi nyata untuk menciptakan bumi yang lebih bersih, sehat,
            dan berkelanjutan bagi generasi mendatang.
          </p>
        </div>
        <div className="md:w-[55%] flex justify-end mt-8 md:mt-0 relative">
          {" "}
          <div className="relative w-[550px] h-[350px] overflow-hidden">
            {" "}
            <img
              src="/assets/images/Karang-Image.png"
              alt="Sea Turtle"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Priority;

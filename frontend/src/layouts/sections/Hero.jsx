import React from "react";
import { motion } from "framer-motion";

import backgroundImage from "/assets/images/Background-Hero.png";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Hero = () => {
  return (
    <section id="hero" className="relative w-full min-h-screen overflow-hidden font-sans bg-black text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      <svg
        className="hidden lg:block absolute top-0 left-0 w-xl h-auto z-10 pointer-events-none"
        viewBox="0 0 879 1066"
        preserveAspectRatio="xMinYMin meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M795.198 945.543C776.436 881.763 765.304 844.434 760.782 817.387C747.665 755.838 750.709 720.214 760.782 656.174L761.363 654.343C776.525 606.579 785.119 579.509 817.84 543.868C824.866 529.8 830.732 522.526 841.388 503.565C856.602 482.509 864.553 470.478 873.088 444.242C881.487 417.661 879.155 404.39 868.559 382.202C841.279 355.365 826.022 340.276 800.632 311.558C773.833 278.041 764.451 254.27 751.725 208.309C744.19 174.339 741.272 155.458 736.328 121.816C732.199 95.5588 728.618 82.3765 721.837 59.3229L638.06 58.87C634.809 57.9726 634.563 53.2608 638.06 52.0773C641.835 50.8 668.854 37.4353 684.251 32.6049C706.361 24.8936 714.057 32.305 723.195 57.0586C740.939 59.822 749.012 65.2124 755.348 82.8709C767.608 123.822 779.155 148.339 798.821 178.874C766.661 105.686 759.402 60.8229 762.593 0H0V1066H728.63C751.218 1053.56 761.795 1044.18 778.896 1025.24C802.444 994.903 804.708 989.016 802.444 979.506C800.179 969.997 795.198 945.543 795.198 945.543Z"
          fill="black"
        />
        <path
          d="M821.01 1066H798.82C810.765 1043.3 809.999 1032.83 807.877 1014.37C821.258 990.795 828.089 976.913 833.689 952.334C840.916 926.612 844.499 911.801 856.785 890.294C860.17 884.308 861.506 883.249 861.766 890.294C864.344 916.63 857.674 970.031 821.01 1066Z"
          fill="black"
        />
        <path
          d="M853.163 523.931C836.575 565.471 828.193 599.317 812.859 655.256C809.108 667.192 807.224 667.178 804.255 655.256C797.29 629.953 800.133 616.051 808.784 591.405C818.415 562.583 828.868 548.41 849.54 523.931C852.424 521.761 853.134 521.913 853.163 523.931Z"
          fill="black"
        />
        <path
          d="M809.688 0H794.292C792.012 10.0481 790.54 15.3438 790.216 26.2651C789.018 52.9037 789.501 68.7704 792.48 98.2676C799.216 138.584 804.82 160.334 816.481 198.347L832.783 208.309C814.876 146.136 804.121 111.727 802.443 39.3976C804.286 16.625 805.804 7.36586 809.688 0Z"
          fill="black"
        />
      </svg>

      <div className="absolute top-0 left-0 w-full lg:w-1/2 h-full z-20 flex flex-col justify-center px-6 sm:px-10 lg:pl-16 lg:pr-10">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="text-4xl sm:text-5xl font-serif lg:text-white lg:text-7xl font-bold mb-4 sm:mb-8 leading-tight lg:leading-16 tracking-tighter"
        >
          <span className="block bg-black/60 px-3 py-1 mb-3 lg:bg-transparent lg:px-0 lg:py-0 lg:mb-0 text-white lg:text-inherit">Aksi Cerdas Demi</span>
          <span className="block bg-black/60 px-3 py-1 mb-3 lg:bg-transparent lg:px-0 lg:py-0 lg:mb-0 text-white lg:text-inherit">Kelestarian</span>
          <span className="relative inline-block">
            <span className="relative z-10 bg-black/60 px-3 py-1 lg:bg-transparent lg:px-0 lg:py-0 text-[#F2C94C]">Laut</span>
            <span className="absolute bottom-0 left-0 w-full h-2/5 bg-[#F2C94C] opacity-30 rounded-md -rotate-1"></span>
          </span>
        </motion.h1>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-base font-sans lg:text-gray-400 mt-2 sm:mt-4 max-w-sm"
        >
          <span className="bg-black/60 px-3 py-1 lg:bg-transparent lg:px-0 lg:py-0 text-white lg:text-inherit">
            BinGo memanfaatkan kecerdasan buatan untuk mendeteksi dan memisahkan
            sampah organik serta anorganik secara instan melalui klasifikasi
            gambar otomatis.
          </span>
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="mt-8 sm:absolute sm:bottom-8 flex flex-col items-start gap-2"
        >
          <span className="text-sm bg-black/60 px-3 py-1 lg:bg-transparent lg:px-0 lg:py-0 text-white lg:text-gray-400">
            Powered by.
          </span>
          <img
            src="/assets/images/logo-dicoding.svg"
            alt="Dicoding"
            className="h-6 bg-black/60 w-auto"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

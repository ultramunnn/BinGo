import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import underwaterImage from "/assets/images/Underwater.png";

const Mission = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=60%",
        pin: true,
        pinSpacing: false,
      });

      gsap.from(contentRef.current.children, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="mission"
      ref={sectionRef}
      className="bg-black text-white py-12 sm:py-20 px-6 sm:px-10 lg:px-16 overflow-x-clip"
    >
      <div
        ref={contentRef}
        className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12"
      >
        <div className="md:w-1/2">
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
        </div>

        <div className="md:w-1/2 flex flex-col justify-between">
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
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
          </div>
          <p className="text-sm sm:text-base mt-4 sm:mt-6 max-w-full">
            Kami berpikir lebih besar untuk membangun ekosistem berkelanjutan
            demi masa depan yang lebih bersih.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Mission;

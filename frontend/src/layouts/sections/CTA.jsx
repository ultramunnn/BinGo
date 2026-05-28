import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CTA = () => {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);
  const textRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(imgRef.current, {
        x: -120,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(textRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(btnRef.current, {
        scale: 0.85,
        opacity: 0,
        duration: 0.6,
        delay: 0.4,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="relative w-full h-screen bg-white overflow-x-clip flex items-center"
    >
      <div className="container mx-auto px-6 md:px-20 h-full flex flex-col md:flex-row items-center justify-between">
        <div
          ref={imgRef}
          className="w-full md:w-[60%] h-[50%] md:h-full flex items-center justify-start md:right-[7%] md:relative"
        >
          <img
            src="/assets/images/hand-trash.png"
            alt="Identifikasi Sampah"
            className="h-full w-auto max-w-none object-contain transform -scale-x-100 md:scale-x-100 scale-110 origin-center"
          />
        </div>

        <div className="w-full md:w-[40%] flex flex-col items-center md:items-end text-center md:text-right z-10">
          <h2
            ref={textRef}
            className="text-4xl md:text-6xl font-serif font-bold text-black leading-[1.1] max-w-2xl"
          >
            Identifikasi <br />
            Sampah dalam <br />
            Genggaman Anda.
          </h2>

          <div ref={btnRef} className="mt-8 md:mt-12">
            <button className="bg-black text-white px-8 md:px-12 py-4 md:py-5 rounded-2xl text-lg md:text-xl font-black hover:bg-gray-900 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.15)] active:scale-95">
              Mulai Sekarang
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;

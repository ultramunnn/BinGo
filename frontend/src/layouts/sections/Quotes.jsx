import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Quotes = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const subRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = textRef.current.querySelectorAll("span");

      gsap.from(lines, {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(subRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="quotes"
      ref={sectionRef}
      className="relative w-full bg-black min-h-screen flex items-center justify-center py-20 px-6 md:px-10 overflow-hidden"
    >
      <div className="flex flex-col items-center justify-center text-center max-w-5xl mx-auto">
        <h1
          ref={textRef}
          className="text-7xl md:text-8xl lg:text-9xl font-black font-sans tracking-tight leading-none mb-8"
        >
          <span className="block text-masked-ocean">Pilah hari ini,</span>
          <span className="block text-masked-ocean">lestari</span>
          <span className="block text-masked-ocean">selamanya.</span>
        </h1>

        <p
          ref={subRef}
          className="text-base md:text-lg text-gray-400 font-sans mt-4 max-w-lg mx-auto"
        >
          Setiap sampah yang terpilah adalah nafas baru bagi lautan.
        </p>
      </div>
    </section>
  );
};

export default Quotes;

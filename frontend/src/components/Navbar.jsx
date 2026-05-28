import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 1. Hitung tinggi Hero (100vh) untuk ganti style navbar
  useEffect(() => {
    const handleScroll = () => {
      // Jika scroll lebih dari tinggi layar (Hero Section)
      if (window.scrollY >= window.innerHeight - 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Lock Scroll saat Mega Menu dibuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const navLinks = [
    { name: "Beranda", href: "/#hero" },
    { name: "Cara Penggunaan", href: "/#cara-penggunaan" },
    { name: "Dampak", href: "/#dampak" },
    { name: "Testimoni", href: "/#testimoni" },
    { name: "Kontak", href: "/#footer" },
  ];

  // Logic: Navbar jadi Solid White jika di-scroll ke bawah ATAU sedang dibuka menu-nya
  const isFullState = isScrolled || isOpen;

  return (
    <>
      {/* Overlay Gelap saat menu dibuka */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
          />
        )}
      </AnimatePresence>

      <motion.nav
        initial={false}
        animate={{
          top: isFullState ? 0 : 32, // Nempel atas jika scrolled/open
          width: isFullState ? "100%" : "90%", // Full width jika scrolled/open
          maxWidth: isFullState ? "100%" : "1200px",
          left: "50%",
          x: "-50%",
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed z-[100] font-sans"
      >
        <motion.div
          animate={{
            // Ganti warna: Putih Solid vs Glass Dark (rgba 63)
            backgroundColor: isFullState ? "#FFFFFF" : "rgba(255, 255, 255, 0.1)",
            borderRadius: isFullState ? "0px" : "16px",
          }}
          className={`relative transition-all duration-300 ${
            isFullState ? "bg-white" : "bg-white"
          }`}
        >
          {/* --- TOP BAR --- */}
          <div className="flex items-center justify-between px-10 py-5 max-w-[1400px] mx-auto">
            {/* Logo BinGo */}
            <div className="flex items-center gap-2">
              <img src="/assets/images/logo-black.svg" alt="BinGo" className="h-8 w-auto" />
            </div>

            {/* Desktop Navigation Links */}
            <ul className={`hidden md:flex items-center gap-8 text-sm font-medium transition-colors ${isFullState ? 'text-black' : 'text-white'}`}>
              {navLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => {
                      const id = link.href.split("#")[1];
                      const el = document.getElementById(id);
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                      } else {
                        window.location.href = link.href;
                      }
                    }}
                    className="hover:opacity-60 transition-opacity cursor-pointer"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <Link to="/login" className="bg-black text-white px-8 py-2.5 rounded-full text-xs font-bold shadow-lg active:scale-95 transition-transform">
                Masuk
              </Link>
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`p-1 transition-colors ${isFullState ? 'text-black' : 'text-white'}`}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* --- MEGA MENU CONTENT (COMPACT) --- */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-white"
              >
                <div className="max-w-[1400px] mx-auto px-10 pb-10">
                  {/* Divider */}
                  <div className="w-full h-[1px] bg-gray-100 mb-8" />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Column 1 */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Perusahaan</h4>
                      <a href="#" className="block text-gray-800 text-sm font-medium hover:text-black hover:pl-1 transition-all">Tentang Kami</a>
                      <a href="#" className="block text-gray-800 text-sm font-medium hover:text-black hover:pl-1 transition-all">Visi & Misi</a>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Layanan</h4>
                      <a href="#" className="block text-gray-800 text-sm font-medium hover:text-black hover:pl-1 transition-all">Identifikasi Sampah</a>
                      <a href="#" className="block text-gray-800 text-sm font-medium hover:text-black hover:pl-1 transition-all">Relawan</a>
                    </div>

                    {/* Column 3: Promo Card Compact */}
                    <div className="border border-gray-100 rounded-2xl p-5 flex items-center justify-between gap-4 bg-gray-50 shadow-sm">
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-gray-900 leading-tight">
                          Pemindaian kini makin penting & mudah diakses.
                        </h3>
                        <a href="#" className="inline-block mt-3 text-[10px] font-bold text-gray-500 underline underline-offset-4 hover:text-black">
                          Selengkapnya
                        </a>
                      </div>
                      <div className="w-20 h-16 bg-white rounded-lg flex-shrink-0 flex items-center justify-center p-2 shadow-inner">
                         {/* Placeholder ikon/gambar kecil */}
                         <div className="w-full h-full bg-cyan-100 rounded opacity-50" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.nav>
    </>
  );
};

export default Navbar;
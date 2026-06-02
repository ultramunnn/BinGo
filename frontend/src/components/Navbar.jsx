import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const SCROLL_THRESHOLD = 1100;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= SCROLL_THRESHOLD) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const navLinks = [
    { name: "Misi", href: "#mission" },
    { name: "Prioritas", href: "#priority" },
    { name: "Cara Penggunaan", href: "#usage" },
    { name: "Kontak", href: "#footer" },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    setTimeout(() => {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const isFullState = isScrolled || isOpen;

  return (
    <>
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
          top: isFullState ? 0 : 32, 
          width: isFullState ? "100%" : "90%", 
          maxWidth: isFullState ? "100%" : "1200px",
          left: "50%",
          x: "-50%",
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed z-[100] font-sans"
      >
        <motion.div
          animate={{
            backgroundColor: isFullState ? "#FFFFFF" : "rgba(255, 255, 255, 0.1)",
            borderRadius: isFullState ? "0px" : "16px",
          }}
          className={`relative transition-all duration-300 ${
            isFullState ? "bg-gray-100" : "bg-gray-50/70 backdrop-blur-sm"
          }`}
        >
          <div className="flex items-center justify-between px-10 py-5 max-w-[1400px] mx-auto">
            <a href="#hero" onClick={(e) => scrollToSection(e, "#hero")} className="flex items-center gap-2">
              <img src={isFullState ? "/assets/images/logo-black.svg" : "/assets/images/logo-white.svg"} alt="BinGo" className="h-8 w-auto" />
            </a>

            <ul className={`hidden md:flex items-center gap-8 text-sm font-medium transition-colors ${isFullState ? 'text-black' : 'text-white'}`}>
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} onClick={(e) => scrollToSection(e, link.href)} className="hover:opacity-60 transition-opacity">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <Link to="/dashboard" className="bg-black text-white px-8 py-2.5 rounded-full text-xs font-bold shadow-lg active:scale-95 transition-transform">
                  Dashboard
                </Link>
              ) : (
                <Link to="/login" className="bg-black text-white px-8 py-2.5 rounded-full text-xs font-bold shadow-lg active:scale-95 transition-transform">
                  Masuk
                </Link>
              )}
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`p-1 transition-colors ${isFullState ? 'text-black' : 'text-white'}`}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-white"
              >
                <div className="max-w-[1400px] mx-auto px-10 pb-10">
                  <div className="w-full h-[1px] bg-gray-100 mb-8" />

                  <div className="md:hidden space-y-4">
                    {navLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        onClick={(e) => scrollToSection(e, link.href)}
                        className="block text-gray-800 text-base font-medium hover:text-black hover:pl-1 transition-all"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>

                  <div className="hidden md:grid grid-cols-3 gap-10">
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Perusahaan</h4>
                      <a href="#" className="block text-gray-800 text-sm font-medium hover:text-black hover:pl-1 transition-all">Tim Kami</a>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Dukungan</h4>
                      <Link to="/privacy" className="block text-gray-800 text-sm font-medium hover:text-black hover:pl-1 transition-all">Kebijakan Privasi</Link>
                      <Link to="/terms" className="block text-gray-800 text-sm font-medium hover:text-black hover:pl-1 transition-all">Syarat dan Ketentuan</Link>
                    </div>

                    <div className="border border-gray-100 rounded-2xl p-7 flex items-center justify-between gap-6 bg-gray-50 shadow-sm">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold font-serif text-gray-900 leading-tight">
                          Pemindaian kini makin penting & mudah diakses.
                        </h3>
                      </div>
                      <div className="w-auto h-32 rounded-md flex-shrink-0 flex items-center justify-center">
                         <img src="/assets/images/navbar-image.png" alt="icon" className="w-full h-full" />
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
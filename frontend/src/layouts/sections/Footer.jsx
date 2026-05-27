import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerData = [
    {
<<<<<<< HEAD
      title: "PRODUCTS",
      links: ["Apps", "Workflows", "Database", "Mobile"],
    },
    {
      title: "SOLUTIONS",
      links: ["AI apps", "External apps", "Integrations", "Self-hosting"],
    },
    {
      title: "RESOURCES",
      links: ["Blog", "Reports"],
    },
    {
      title: "DEVELOPERS",
      links: ["Documentation", "Changelog", "Status", "Developer Network"],
=======
      title: "PRODUK",
      links: ["Scan Sampah", "Peta Pantai", "Riwayat", "Artikel Edukasi"],
    },
    {
      title: "SOLUSI",
      links: ["Klasifikasi AI", "Pemetaan Lokasi", "Rekomendasi Daur Ulang", "Edukasi Masyarakat"],
    },
    {
      title: "SUMBER DAYA",
      links: ["Blog", "Laporan"],
    },
    {
      title: "PENGEMBANG",
      links: ["Dokumentasi", "Rilis", "Status", "Jaringan Pengembang"],
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
    },
  ];

  return (
    <footer className="w-full bg-black text-white px-8 md:px-16 font-sans overflow-visible relative">
      <div className="max-w-[1400px] mx-auto flex flex-col">
        {/* --- SECTION 1: GRID ATAS (5 Kolom) --- */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-10">
          {footerData.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-gray-500 text-[10px] tracking-[0.2em] font-bold mb-6 uppercase">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-300 text-base hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Kolom ke-5: Company & Buttons saja */}
          <div className="flex flex-col items-start md:items-end">
            <h4 className="text-gray-500 text-[10px] tracking-[0.2em] font-bold mb-6 uppercase">
<<<<<<< HEAD
              COMPANY
=======
              PERUSAHAAN
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
            </h4>
            <ul className="space-y-4 md:text-right">
              <li>
                <a
                  href="#"
                  className="text-gray-300 text-base hover:text-white"
                >
<<<<<<< HEAD
                  About
=======
                  Tentang
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 text-base hover:text-white"
                >
<<<<<<< HEAD
                  Careers
=======
                  Karir
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 text-base hover:text-white"
                >
<<<<<<< HEAD
                  Partners
=======
                  Mitra
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
                </a>
              </li>
            </ul>

            <div className="flex flex-col items-start md:items-end gap-3 mt-10">
              <button className="bg-white text-black text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-full hover:bg-gray-200 transition-all">
<<<<<<< HEAD
                START FOR FREE
              </button>
              <button className="bg-transparent border border-gray-600 text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-full hover:bg-white/10 transition-all">
                BOOK A DEMO
=======
                MULAI GRATIS
              </button>
              <button className="bg-transparent border border-gray-600 text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-full hover:bg-white/10 transition-all">
                JADWAL DEMO
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
              </button>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: BAWAH (Logo Kiri, Links Kanan) --- */}
        {/* Bagian ini ditaruh DI LUAR grid agar bisa justify-between full width */}
        <div className="flex justify-between items-end w-full">
          {/* Logo BinGo di Pojok Kiri */}
          <div className="flex items-center gap-4 relative bottom-16">
            <img src="assets\images\logo-white.svg" alt="" 
            className="w-32 h-auto"/>
            <h1 className="text-7xl md:text-8xl font-bold leading-[0.8] tracking-tighter text-white">
              BinGo
            </h1>
          </div>

          {/* Legal Links di Pojok Kanan */}
          <div className="flex flex-col items-end gap-2 pb-[4vw] text-[10px] font-bold text-gray-400 tracking-widest uppercase opacity-60">
            <Link to="/terms" className="hover:text-white transition-colors">
<<<<<<< HEAD
              Terms of Use
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <a href="#" className="hover:text-white transition-colors">
              Security
=======
              Syarat Penggunaan
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Kebijakan Privasi
            </Link>
            <a href="#" className="hover:text-white transition-colors">
              Keamanan
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
            </a>
            <span className="mt-2 text-gray-600">© BINGO 2024</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

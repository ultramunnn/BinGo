import React from "react";
import { Camera, Send, Globe, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Layanan",
      links: ["Identifikasi Sampah", "Peta Pantai", "Leaderboard", "Artikel"],
    },
    {
      title: "Perusahaan",
      links: ["Tentang Kami", "Visi & Misi", "Tim Kami", "Karir"],
    },
    {
      title: "Dukungan",
      links: [
        "Pusat Bantuan",
        "Kebijakan Privasi",
        "Syarat & Ketentuan",
        "Kontak",
      ],
    },
  ];

  return (
    <footer id="footer" className="w-full bg-black font-sans">
      <div className="max-w-300 mx-auto px-6 md:px-12 py-8 md:py-8">
        <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-8">
          <div className="flex flex-col gap-4 max-w-xs">
            <div className="flex items-center gap-2">
              <img
                src="/assets/images/logo-white.svg"
                alt="BinGo"
                className="h-7 w-auto"
              />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Platform berbasis AI untuk mengidentifikasi dan mengklasifikasikan
              sampah di kawasan pantai Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-slate-500 hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-white/10 my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-center">
          <p className="text-xs text-slate-500">
            &copy; {currentYear} BinGo. Capstone Project DBS Foundation x
            Dicoding.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

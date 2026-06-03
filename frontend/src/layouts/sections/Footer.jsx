import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Layanan",
      links: [
        { label: "Misi", href: "#mission" },
        { label: "Prioritas", href: "#priority" },
        { label: "Cara Penggunaan", href: "#usage" },
        { label: "Kontak", href: "#footer" },
      ],
    },
    {
      title: "Perusahaan",
      links: [
        { label: "Tim Kami", href: "#" },
      ],
    },
    {
      title: "Dukungan",
      links: [
        { label: "Kebijakan Privasi", href: "/privacy" },
        { label: "Syarat & Ketentuan", href: "/terms" },
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
                    <li key={link.label}>
                      {link.href.startsWith("/") ? (
                        <Link
                          to={link.href}
                          className="text-sm text-slate-500 hover:text-white transition-colors"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          className="text-sm text-slate-500 hover:text-white transition-colors"
                        >
                          {link.label}
                        </a>
                      )}
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

import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../layouts/sections/Footer";

const Terms = () => {
  return (
    <main className="relative bg-white">
      <Navbar />

      {/* Content */}
      <div className="max-w-[800px] mx-auto px-6 md:px-12 pt-32 pb-20 font-sans">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link to="/" className="hover:text-gray-600 transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <span className="text-gray-600 font-medium">Syarat & Ketentuan</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-[#333c4d] mb-2">
          Syarat & Ketentuan
        </h1>
        <p className="text-sm text-gray-400 mb-10">
          Terakhir diperbarui: 20 Mei 2026
        </p>

        <div className="space-y-8 text-gray-600 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#333c4d] mb-3">
              1. Pendahuluan
            </h2>
            <p>
              Selamat datang di BinGo. Dengan mengakses dan menggunakan platform
              ini, Anda menyetujui untuk terikat oleh syarat dan ketentuan yang
              berlaku. Jika Anda tidak setuju dengan bagian mana pun dari syarat
              ini, mohon untuk tidak menggunakan layanan kami.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#333c4d] mb-3">
              2. Definisi
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong className="text-[#333c4d]">Platform</strong> merujuk
                pada aplikasi web BinGo yang dapat diakses melalui browser.
              </li>
              <li>
                <strong className="text-[#333c4d]">Pengguna</strong> adalah
                setiap individu yang mengakses atau menggunakan Platform.
              </li>
              <li>
                <strong className="text-[#333c4d]">Layanan</strong> mencakup
                fitur identifikasi sampah, peta pantai, leaderboard, dan artikel
                edukasi yang tersedia di Platform.
              </li>
              <li>
                <strong className="text-[#333c4d]">Relawan</strong> adalah
                pengguna yang berpartisipasi aktif dalam kegiatan pemantauan dan
                pembersihan pantai melalui Platform.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#333c4d] mb-3">
              3. Penggunaan Platform
            </h2>
            <p className="mb-3">
              Anda setuju untuk menggunakan Platform hanya untuk tujuan yang sah
              dan sesuai dengan syarat ini. Anda dilarang:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Menggunakan Platform untuk aktivitas ilegal atau yang melanggar
                hukum.
              </li>
              <li>
                Mengunggah konten yang mengandung malware, virus, atau kode
                berbahaya lainnya.
              </li>
              <li>
                Mengganggu atau merusak integritas atau performa Platform.
              </li>
              <li>
                Mengakses Platform secara tidak sah melalui bot, scraper, atau
                cara otomatis lainnya.
              </li>
              <li>
                Meniru identitas pengguna lain atau entitas lain.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#333c4d] mb-3">
              4. Akun Pengguna
            </h2>
            <p>
              Untuk menggunakan fitur tertentu, Anda perlu membuat akun. Anda
              bertanggung jawab untuk menjaga kerahasiaan informasi akun Anda,
              termasuk kata sandi. Anda setuju untuk segera memberitahu kami
              jika terjadi penggunaan tidak sah pada akun Anda.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#333c4d] mb-3">
              5. Konten Pengguna
            </h2>
            <p>
              Dengan mengunggah foto, data lokasi, atau konten lainnya ke
              Platform, Anda memberikan BinGo lisensi non-eksklusif untuk
              menggunakan, menampilkan, dan memproses konten tersebut demi
              penyediaan Layanan. Anda tetap memiliki hak atas konten yang Anda
              unggah.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#333c4d] mb-3">
              6. Kekayaan Intelektual
            </h2>
            <p>
              Seluruh konten, desain, logo, dan elemen visual yang terdapat pada
              Platform merupakan milik BinGo atau pemberi lisensinya. Anda tidak
              diperbolehkan menyalin, memodifikasi, atau mendistribusikan konten
              tersebut tanpa izin tertulis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#333c4d] mb-3">
              7. Batasan Tanggung Jawab
            </h2>
            <p>
              BinGo menyediakan Platform "sebagaimana adanya". Kami tidak
              menjamin bahwa Platform akan selalu tersedia, bebas dari gangguan,
              atau tanpa kesalahan. Hasil identifikasi sampah oleh AI bersifat
              estimasi dan tidak dapat dijadikan sebagai satu-satunya dasar
              pengambilan keputusan.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#333c4d] mb-3">
              8. Perubahan Syarat
            </h2>
            <p>
              Kami berhak untuk mengubah syarat dan ketentuan ini sewaktu-waktu.
              Perubahan akan diberitahukan melalui Platform. Penggunaan Platform
              secara berkelanjutan setelah perubahan merupakan persetujuan Anda
              terhadap syarat yang baru.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#333c4d] mb-3">
              9. Hubungi Kami
            </h2>
            <p>
              Jika Anda memiliki pertanyaan mengenai syarat dan ketentuan ini,
              silakan hubungi kami melalui email di{" "}
              <a
                href="mailto:hello@bingo.id"
                className="text-[#4BAFBC] hover:underline"
              >
                hello@bingo.id
              </a>
              .
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default Terms;

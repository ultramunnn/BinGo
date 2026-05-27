import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../layouts/sections/Footer";

const Privacy = () => {
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
          <span className="text-gray-600 font-medium">Kebijakan Privasi</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-[#333c4d] mb-2">
          Kebijakan Privasi
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
              BinGo menghargai privasi Anda. Kebijakan Privasi ini menjelaskan
              bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi
              pribadi Anda saat menggunakan platform kami.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#333c4d] mb-3">
              2. Informasi yang Kami Kumpulkan
            </h2>
            <p className="mb-3">
              Kami mengumpulkan beberapa jenis informasi untuk menyediakan dan
              meningkatkan layanan kami:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong className="text-[#333c4d]">Informasi Akun:</strong>{" "}
                nama, alamat email, dan kata sandi yang Anda berikan saat
                mendaftar.
              </li>
              <li>
                <strong className="text-[#333c4d]">Data Lokasi:</strong>{" "}
                informasi geografis saat Anda menggunakan fitur peta pantai atau
                mengunggah foto sampah.
              </li>
              <li>
                <strong className="text-[#333c4d]">Foto & Gambar:</strong>{" "}
                gambar yang Anda unggah melalui fitur scan untuk proses
                identifikasi AI.
              </li>
              <li>
                <strong className="text-[#333c4d]">Data Penggunaan:</strong>{" "}
                informasi tentang bagaimana Anda berinteraksi dengan Platform,
                termasuk halaman yang dikunjungi dan fitur yang digunakan.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#333c4d] mb-3">
              3. Penggunaan Informasi
            </h2>
            <p className="mb-3">Informasi yang kami kumpulkan digunakan untuk:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Menyediakan dan memelihara layanan BinGo.</li>
              <li>
                Memproses dan meningkatkan akurasi identifikasi sampah melalui
                AI.
              </li>
              <li>Menampilkan data di peta pantai dan leaderboard.</li>
              <li>
                Mengirimkan notifikasi terkait aktivitas akun Anda.
              </li>
              <li>
                Meningkatkan pengalaman pengguna dan mengembangkan fitur baru.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#333c4d] mb-3">
              4. Penyimpanan & Keamanan Data
            </h2>
            <p>
              Kami menerapkan langkah-langkah keamanan yang wajar untuk
              melindungi informasi pribadi Anda dari akses tidak sah, perubahan,
              pengungkapan, atau penghancuran. Data Anda disimpan di server
              yang aman dan hanya dapat diakses oleh personel yang berwenang.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#333c4d] mb-3">
              5. Berbagi Informasi
            </h2>
            <p>
              Kami tidak menjual atau menyewakan informasi pribadi Anda kepada
              pihak ketiga. Kami dapat membagikan data secara agregat dan anonim
              untuk keperluan penelitian atau pelaporan dampak lingkungan. Data
              lokasi pantai yang dikumpulkan oleh relawan dapat ditampilkan
              secara publik di fitur Peta Pantai.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#333c4d] mb-3">
              6. Cookie & Teknologi Pelacakan
            </h2>
            <p>
              BinGo menggunakan cookie dan teknologi serupa untuk meningkatkan
              pengalaman pengguna, menganalisis tren, dan mengelola Platform.
              Anda dapat mengatur preferensi cookie melalui pengaturan browser
              Anda.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#333c4d] mb-3">
              7. Hak Anda
            </h2>
            <p className="mb-3">
              Sebagai pengguna, Anda memiliki hak untuk:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Mengakses dan melihat data pribadi yang kami simpan.</li>
              <li>Memperbarui atau mengoreksi informasi pribadi Anda.</li>
              <li>
                Meminta penghapusan akun dan data pribadi Anda.
              </li>
              <li>
                Menarik persetujuan pengolahan data kapan saja.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#333c4d] mb-3">
              8. Privasi Anak
            </h2>
            <p>
              Platform kami tidak ditujukan untuk anak di bawah usia 13 tahun.
              Kami tidak secara sengaja mengumpulkan informasi pribadi dari anak
              di bawah usia tersebut. Jika Anda adalah orang tua atau wali dan
              mengetahui bahwa anak Anda telah memberikan informasi pribadi
              kepada kami, silakan hubungi kami.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#333c4d] mb-3">
              9. Perubahan Kebijakan
            </h2>
            <p>
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu.
              Perubahan signifikan akan diberitahukan melalui Platform atau
              email. Kami mendorong Anda untuk meninjau kebijakan ini secara
              berkala.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#333c4d] mb-3">
              10. Hubungi Kami
            </h2>
            <p>
              Jika Anda memiliki pertanyaan atau kekhawatiran mengenai
              Kebijakan Privasi ini, silakan hubungi kami melalui email di{" "}
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

export default Privacy;

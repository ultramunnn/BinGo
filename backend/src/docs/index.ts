import { authDocs } from "./auth.docs";
import { schemas } from "./schemas.docs";
// import { userDocs } from './user.docs';  // nanti ditambahkan
// import { wasteDocs } from './waste.docs'; // nanti ditambahkan

// Gabungkan semua paths dari berbagai modul
const paths = {
  ...authDocs.paths,
  // ...userDocs.paths,
  // ...wasteDocs.paths,
};

export const docs = {
  openapi: "3.0.0",
  info: {
    title: "BinGo - Beach Waste Classification API",
    version: "1.0.0",
    description: `
      API Documentation untuk aplikasi BinGo: Your AI Lens for a Cleaner Beach
      
      BinGo adalah platform inovatif berbasis computer vision dan machine learning 
      yang mengidentifikasi dan mengklasifikasikan sampah di kawasan pantai.
      
      Fitur API:
      - 🔐 Authentication - Register, Login, Logout, Reset Password
      - 👤 User Profile - CRUD profil dan foto profil
      - 🗑️ Waste Classification - Identifikasi sampah (Vision + Text)
      
      Role:
      - User - Akses semua fitur utama
      - Admin - Tambahan akses CMS
    `,
    contact: {
      name: "BinGo Development Team",
      email: "bingo@example.com",
    },
  },
  servers: [
    { url: "http://localhost:3000", description: "Development Server" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Masukkan token JWT dari login",
      },
    },
    schemas,
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: "Authentication", description: "Endpoint autentikasi" },
    { name: "User Profile", description: "Manajemen profil pengguna" },
    { name: "Waste Classification", description: "Klasifikasi sampah" },
    { name: "CMS", description: "Manajemen konten (Admin only)" },
  ],
  paths,
};

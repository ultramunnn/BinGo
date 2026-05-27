import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
<<<<<<< HEAD
import tailwindcss from '@tailwindcss/vite' 
=======
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
<<<<<<< HEAD
  ],
=======
    basicSsl(),
  ],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true, // Active les sourcemaps pour le débogage
  },
  preview: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 4173,
    allowedHosts: ['supra-code-client.onrender.com'],
    headers: {
      // Renforce la détection de langue & indique de ne pas traduire
      'Content-Language': 'fr',
      'X-Robots-Tag': 'notranslate'
    }
  },
})

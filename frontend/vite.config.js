// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'copy-config',
      closeBundle() {
        // Copy config.json to dist folder after build
        try {
          copyFileSync('config.json', 'dist/config.json')
        } catch (err) {
          console.error('Failed to copy config.json:', err)
        }
      }
    }
  ],
  server: {
    allowedHosts: [
      "germaine-preeruptive-gannon.ngrok-free.dev",
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})

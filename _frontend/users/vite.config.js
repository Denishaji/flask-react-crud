import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:5000',
    },
  },
  build: {
    outDir: path.resolve(__dirname, '../dist'),  // Output folder at project root
    emptyOutDir: true,                            // Clean before building
  },
  plugins: [react()],
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages may serve the app below a repository path.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
  server: {
    // Local development proxy; production requests use the configured API URL.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})

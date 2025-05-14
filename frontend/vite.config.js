import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all interfaces
    port: 5173,
    proxy: {
      '/login': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
    hmr: {
      protocol: 'ws',
      host: 'lab.poridhi.io', // Base domain for HMR
    },
    allowedHosts: [
      '.poridhi.io',      // All subdomains of poridhi.io
      '.lab.poridhi.io',  // All subdomains of lab.poridhi.io
    ],
  },
})

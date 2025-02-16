// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173, // Standardporten for Vite
    open: true, // Åpner automatisk i nettleseren ved oppstart
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});

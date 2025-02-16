import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  server: {
    port: 5173, // Endre hvis du vil bruke en annen port
    open: true, // Åpner nettleseren automatisk ved oppstart
    proxy: {
      "/api": {
        target: "https://v2.api.noroff.dev", // Erstatt med riktig API-URL om nødvendig
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Nå kan du bruke "@/js/router/views/home.js"
    },
  },
});

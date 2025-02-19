import { defineConfig } from "vite";

export default defineConfig({
  base: "/", // Viktig for at Netlify skal finne riktige paths!
  build: {
    outDir: "dist",
  },
  server: {
    port: 5173,
    open: true,
  },
});

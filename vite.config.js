import { defineConfig } from 'vite';

export default defineConfig({
  base: "/", // Sikrer at alle filer får riktig sti i dist/
  build: {
    outDir: "dist", // Output til dist-mappen
    assetsDir: "assets", // Plasserer statiske filer i en egen assets-mappe
    emptyOutDir: true, // Sletter gammel build før ny lages
  },
  server: {
    port: 5173, // Standardport for utvikling
    open: true, // Åpner nettleseren automatisk
  },
});

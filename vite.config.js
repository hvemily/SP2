import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  appType: "mpa", // Multi-page Application
  base: "", // Tom base for relativ navigasjon
  build: {
    sourcemap: true,
    target: "esnext",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"), // Hovedsiden
        login: resolve(__dirname, "auth/login/index.html"),
        register: resolve(__dirname, "auth/register/index.html"),
        profile: resolve(__dirname, "profile/index.html"),
        category: resolve(__dirname, "listing/category/index.html"),
        create: resolve(__dirname, "listing/create/index.html"),
        edit: resolve(__dirname, "listing/edit/index.html"),
      },
    },
  },
});

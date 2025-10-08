import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Tämä ohjaa kaikki pyynnöt /api/... backendille
      "/api": {
        target: "localhost:3001", // Backendin URL
        changeOrigin: true, // Vaihda alkuperä, jos palvelin vaatii sen
        secure: false, // Ei käytetä HTTPS:ää (kehityksessä)
      },
    },
  },
});

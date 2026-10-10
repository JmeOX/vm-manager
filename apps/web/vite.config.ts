import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const API_URL = "http://localhost:4000";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "./src") },
  },
  server: {
    port: 5173,
    // proxy: el navegador solo ve localhost:5173; Vite reenvía estas rutas a la API.
    proxy: {
      "/api": API_URL,
      "/socket.io": { target: API_URL, ws: true }, // ws: true → también reenvía WebSockets
    },
  },
});

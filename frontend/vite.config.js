import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// In development the React app (port 5173) talks to the Node API (port 5000)
// through this proxy, so the browser never sees a cross-origin request.
const backend = process.env.VITE_BACKEND_URL || "http://localhost:5000";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": backend,
      "/socket.io": { target: backend, ws: true },
    },
  },
});

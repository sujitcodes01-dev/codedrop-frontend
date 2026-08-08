import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Standard Vite config. No proxy needed — the frontend calls the
// Spring Boot backend directly at http://localhost:8080, and the
// backend's CorsConfig already allows http://localhost:5173.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
});

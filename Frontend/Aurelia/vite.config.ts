import { defineConfig } from "vite";
import { readFileSync } from "node:fs";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    https: {
      key: readFileSync("C:/Windows/System32/localhost+2-key.pem"),
      cert: readFileSync("C:/Windows/System32/localhost+2.pem"),
    },
  },
});

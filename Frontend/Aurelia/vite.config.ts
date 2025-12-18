import { defineConfig } from "vite";
import { readFileSync } from "node:fs";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    https: {
      key: readFileSync("C:/Windows/System32/localhost+2-key.pem"),
      cert: readFileSync("C:/Windows/System32/localhost+2.pem"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react', 'react-hot-toast'],
          'chart-vendor': ['chart.js', 'react-chartjs-2', 'recharts'],
          'map-vendor': ['leaflet', 'react-leaflet'],
          'ai-vendor': ['@mediapipe/pose', '@mediapipe/camera_utils'],
          'firebase-vendor': ['firebase'],
          'signalr-vendor': ['@microsoft/signalr'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    assetsInlineLimit: 4096, 
    cssCodeSplit: true,
    sourcemap: false, 
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'framer-motion',
    ],
  },
});

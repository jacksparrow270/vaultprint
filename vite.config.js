import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { compression } from "vite-plugin-compression2";

export default defineConfig({
  plugins: [
    react(),
    // Brotli — best compression ratio, served by Vercel/Nginx automatically
    compression({ algorithm: "brotliCompress", exclude: /\.(png|jpg|avif|webp|gif|svg)$/ }),
    // Gzip fallback for older proxies
    compression({ algorithm: "gzip", exclude: /\.(png|jpg|avif|webp|gif|svg)$/ }),
  ],
  build: {
    // Raise warning threshold — three.js chunk is intentionally large
    chunkSizeWarningLimit: 900,
    // Enable CSS code splitting so non-critical CSS loads lazily
    cssCodeSplit: true,
    // Inline small assets as base64 to save round-trips
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // Immutable hashed filenames for long-lived caching
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
        manualChunks: {
          // GSAP is used across multiple sections — its own chunk

          gsap: ["gsap"],
          // React runtime + Lenis — small, load together
          vendor: ["react", "react-dom", "lenis"],
          // lucide-react icons — tree-shaken but still sizeable
          icons: ["lucide-react"],
        },
      },
    },
  },
});

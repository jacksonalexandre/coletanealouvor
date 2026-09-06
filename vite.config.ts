import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "Coletânea de Louvor",
        short_name: "Coletânea",
        description: "Projeção de letras e hinos com controle em tela separada",
        lang: "pt-BR",
        start_url: "/",
        scope: "/",
        display: "standalone",
        display_override: ["fullscreen", "standalone"],
        orientation: "any",
        background_color: "#0b0f19",
        theme_color: "#0b0f19",
        icons: [
          { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
          { src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /\/data\/.*\.json$/,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "acervo-json", expiration: { maxEntries: 32 } },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: { "@": path.resolve(process.cwd(), "src") },
  },
});

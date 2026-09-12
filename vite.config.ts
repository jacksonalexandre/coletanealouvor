import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";

// Netlify/Vercel servem a partir da raiz; GitHub Pages de projeto serve em /<repo>/.
// BASE_PATH deixa o mesmo build funcionar nos dois, sem hardcode de "/" no código.
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "Coletânea de Louvor",
        short_name: "Coletânea",
        description: "Hinário Adventista projetado em tela separada, com o vídeo de cada hino",
        lang: "pt-BR",
        start_url: base,
        scope: base,
        display: "standalone",
        display_override: ["fullscreen", "standalone"],
        orientation: "any",
        background_color: "#0b0f19",
        theme_color: "#0b0f19",
        icons: [
          { src: `${base}favicon.svg`, sizes: "any", type: "image/svg+xml" },
          { src: `${base}favicon.svg`, sizes: "any", type: "image/svg+xml", purpose: "maskable" },
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

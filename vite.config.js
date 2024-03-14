import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const obj = {
  registerType: "prompt",
  includeAssets: ["auth.svg"],
  manifest: {
    name: "2FA",
    short_name: "2FA",
    descriiption: "App For two step authenicator",
    display: "standalone",
    theme_color: "#000000",
    background_color: "#000000",
    scope: "/",
    start_url: "/",
    orientation: "portrait",

    icons: [
      {
        src: "/auth.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
      {
        src: "/auth.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any maskable",
      },
    ],
  },
};

export default defineConfig({
  plugins: [react(), VitePWA(obj)],
  server: {
    port: 4444,
    host: "192.168.0.169",
  },
});

import { enterDevPlugin } from "vite-plugin-enter-dev";
import { enterProdPlugin } from "vite-plugin-enter-dev";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
export default defineConfig({
  plugins: [react(), ...enterProdPlugin(), ...enterDevPlugin({
    react: false
  })],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  server: {
    host: "127.0.0.1"
  }
});

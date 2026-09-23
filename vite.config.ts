import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, type PluginOption } from "vite";
import { enterDevPlugin, enterProdPlugin } from "vite-plugin-enter-dev";
import { modelPageHeadPlugin } from "./model-page-head";

const SUBPATH_ASSETS_DIR = "_prompts";
const publicAssetDirectories = ["locales", "fonts", "images", "media", "brand-footer"];
const projectRoot = fileURLToPath(new URL(".", import.meta.url));

function copyPublicAssetsToNamespace(): PluginOption {
  return {
    name: "enter-public-assets-prompts-namespace",
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        if (request.url?.startsWith(`/${SUBPATH_ASSETS_DIR}/`)) {
          request.url = request.url.slice(SUBPATH_ASSETS_DIR.length + 1);
        }
        next();
      });
    },
    closeBundle() {
      for (const directory of publicAssetDirectories) {
        const source = path.resolve(projectRoot, "public", directory);
        if (!fs.existsSync(source)) continue;
        const destination = path.resolve(projectRoot, "dist", SUBPATH_ASSETS_DIR, directory);
        fs.mkdirSync(destination, { recursive: true });
        fs.cpSync(source, destination, { recursive: true });
      }
    },
  };
}

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    ...enterProdPlugin(),
    ...enterDevPlugin({ react: false }),
    copyPublicAssetsToNamespace(),
    modelPageHeadPlugin(projectRoot),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "127.0.0.1",
  },
  build: {
    outDir: "dist",
    assetsDir: SUBPATH_ASSETS_DIR,
    manifest: true,
    rollupOptions: {
      output: {
        // Keep the unchanged SDK content hash independent of catalog releases.
        // This remains a synchronous dependency: no consent, event or replay delay.
        manualChunks(id) {
          if (id.includes("/node_modules/") && id.includes("/mixpanel-browser/")) return "mixpanel-sdk";
        },
      },
    },
  },
});

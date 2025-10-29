import react from "@vitejs/plugin-react";
import process from "process";
import { fileURLToPath, URL } from "url";
import { defineConfig, loadEnv } from "vite";
// import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const DEVELOPMENT = env.VITE_NODE_ENV == "development";
  const LOCAL = env.VITE_NODE_ENV == "local";
  const basePath = LOCAL
    ? "/"
    : DEVELOPMENT
    ? "/proyectos/dev-cotizador/"
    : "/";

  return {
    base: basePath,
    plugins: [
      react(),
      // VitePWA({
      //   registerType: "autoUpdate",
      //   workbox: {
      //     // Allow caching larger bundles like react-vendor (~4.5 MB)
      //     maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
      //   },
      // }),
    ].filter(Boolean),
    build: {
      minify: "esbuild",
      cssMinify: "lightningcss",
      // No calcular tamaños comprimidos para acelerar el build
      reportCompressedSize: false,
      // Mapas de fuente deshabilitados por defecto (más rápido)
      sourcemap: false,
      // Objetivo moderno reduce transformaciones (más agresivo en FAST_BUILD)
      target: "esnext",
      // En modo FAST, no separar CSS para reducir E/S
      cssCodeSplit: true,
      // Quitar console/debugger y comentarios de licencia
      esbuild: {
        drop: ["console", "debugger"],
        legalComments: "none",
      },
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (
              id.includes("node_modules/react") ||
              id.includes("node_modules/react-dom")
            ) {
              return "react-vendor";
            }
            if (id.includes("node_modules/primereact")) {
              return "primereact";
            }
            if (
              id.includes("node_modules/lodash") ||
              id.includes("node_modules/moment") ||
              id.includes("node_modules/date-fns")
            ) {
              return "utils";
            }
            if (id.includes("/components/")) {
              return "ui-components";
            }
          },
        },
      },
      chunkSizeWarningLimit: 3000,
    },

    resolve: {
      dedupe: ["react", "react-dom"],
      alias: {
        "@components": fileURLToPath(
          new URL("./src/components", import.meta.url)
        ),
        "@utils": fileURLToPath(new URL("./src/utils", import.meta.url)),
        "@hooks": fileURLToPath(new URL("./src/hooks", import.meta.url)),
        "@libs": fileURLToPath(new URL("./src/libs", import.meta.url)),
      },
    },
    experimental: {
      enableNativePlugin: true,
    },
  };
});

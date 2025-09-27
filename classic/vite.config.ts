import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  base: '/wedding-templates/classic/',
  build: {
    outDir: resolve(__dirname, "dist"), // output build
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, "./index.html"), // index.html sebagai entry
      output: {
        manualChunks: undefined, // disable code splitting
      },
    },
    cssCodeSplit: false, // gabungkan semua CSS jadi satu file
    assetsInlineLimit: Infinity, // inline semua asset ke dalam file
    sourcemap: false,
  },
});

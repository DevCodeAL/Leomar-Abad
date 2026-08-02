import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // ESM-safe equivalent of path.resolve(__dirname, "./src")
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});

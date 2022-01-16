import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@frontend": path.resolve(__dirname, "./src"),
      "@client": path.resolve(__dirname, "../client/src"),
      "@core": path.resolve(__dirname, "../core/src"),
      "@backend": path.resolve(__dirname, "../backend/src"),
    },
  },
});

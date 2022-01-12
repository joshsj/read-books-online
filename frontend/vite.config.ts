import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@/common": path.resolve(__dirname, "../common"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

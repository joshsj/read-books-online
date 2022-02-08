/// <reference types="./src/env" />

import vue from "@vitejs/plugin-vue";
import { readFile } from "fs/promises";
import { ServerOptions } from "https";
import path from "path";
import { defineConfig, loadEnv } from "vite";

export default async ({ mode }) => {
  const { VITE_HTTPS_KEY_PATH, VITE_HTTPS_CERT_PATH } = loadEnv(
    mode,
    process.cwd()
  ) as ImportMetaEnv;

  const https: ServerOptions = {
    key: await readFile(VITE_HTTPS_KEY_PATH),
    cert: await readFile(VITE_HTTPS_CERT_PATH),
  };

  return defineConfig({
    plugins: [vue()],
    server: { https },
    resolve: {
      alias: {
        "@frontend": path.resolve(__dirname, "./src"),
        "@client": path.resolve(__dirname, "../client/src"),
        "@core": path.resolve(__dirname, "../core/src"),
        "@backend": path.resolve(__dirname, "../backend/src"),
      },
    },
  });
};

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue2";
import * as path from "path";

const resolvePath = (str: string) => path.resolve(__dirname, str);

export default defineConfig(({ command }) => ({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolvePath("src"),
      "@/modules": resolvePath("src/types"),
      "@lib": resolvePath("src"),
    },
  },
  root: command === "serve" ? resolvePath("src/playground") : undefined,
  build: {
    lib: {
      entry: resolvePath("src/index.ts"),
      name: "TextCaptcha",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.es.js" : "index.cjs"),
    },
    rollupOptions: {
      external: ["vue"],
      output: { globals: { vue: "Vue" } },
    },
  },
}));

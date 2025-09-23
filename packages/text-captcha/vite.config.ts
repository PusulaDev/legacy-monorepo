import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue2";
import dts from "vite-plugin-dts";
import * as path from "path";

const resolvePath = (str: string) => path.resolve(__dirname, str);

export default defineConfig(({ command }) => ({
  plugins: [
    vue(),
    dts({
      entryRoot: "src",
      outDir: "dist",
      tsconfigPath: "tsconfig.json",
      copyDtsFiles: true,
      include: ['src/**/*.ts', 'src/**/*.vue', 'shims-vue.d.ts'],
      exclude: ["src/playground"]
    })
  ],
  resolve: {
    alias: {
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
    outDir: "dist",
    rollupOptions: {
      external: ["vue", "vue-demi"],
      output: {
        exports: "named"
      }
    }
  }
}));

import { defineConfig } from "vite";
import * as path from "path";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import dts from "vite-plugin-dts"

const resolvePath = (str: string) => path.resolve(__dirname, str);

export default defineConfig({
    build: {
        sourcemap: true,
        lib: {
            entry: resolvePath("src/index.ts"),
            name: "index",
            fileName: "index",
        },
    },
    plugins: [
        peerDepsExternal(),
        dts({
            insertTypesEntry: true,
            skipDiagnostics: false,
            exclude: ["src/**/__tests__/*.ts","src/**/*.spec.ts"],
        }),
    ],
});

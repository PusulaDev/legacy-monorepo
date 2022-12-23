import { defineConfig } from "vite";
import typescript from "@rollup/plugin-typescript";
import * as path from "path";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

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
        typescript({
            rootDir: resolvePath("src"),
            declaration: true,
            declarationDir: resolvePath("dist"),
            exclude: [
                resolvePath("node_modules/**"),
                resolvePath("src/**/*.spec.ts"),
                resolvePath("src/**/__tests__/*.ts"),
            ],
        }),
    ],
});

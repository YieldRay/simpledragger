import { defineConfig } from "vite";
import _minifyHTML from "rollup-plugin-minify-html-literals";
// @ts-ignore
const minifyHTML: _minifyHTML = _minifyHTML.default;

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
    return {
        build: {
            lib: {
                entry: "src/index.ts",
                formats: ["es"],
            },
            minify: "esbuild",
            target: "esnext",
            rollupOptions: {
                plugins: [minifyHTML()],
            },
        },
    };
});

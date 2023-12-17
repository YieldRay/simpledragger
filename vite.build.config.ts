import { defineConfig } from "vite";
import { minifyTemplateLiterals } from "rollup-plugin-minify-template-literals";

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: "src/index.ts",
            formats: ["es"],
            fileName: "index",
        },
        minify: false,
        target: "esnext",
        rollupOptions: {
            plugins: [minifyTemplateLiterals()],
        },
    },
});

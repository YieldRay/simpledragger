import pkg from "./package.json" assert { type: "json" };
import resolve from "@rollup/plugin-node-resolve";
import esbuild from "rollup-plugin-esbuild";
import _minifyHTML from "rollup-plugin-minify-html-literals";
//@ts-ignore
const minifyHTML = _minifyHTML.default;

export default {
    input: "./src/index.ts",
    output: [
        {
            file: pkg.module,
            format: "es",
        },
        {
            file: pkg.main,
            format: "umd",
            name: pkg.name,
        },
    ],
    plugins: [
        resolve(),
        minifyHTML(),
        esbuild({
            // All options are optional
            include: /\.[jt]sx?$/, // default, inferred from `loaders` option
            exclude: /node_modules/, // default
            sourceMap: true, // default
            minify: process.env.NODE_ENV === "production",
            target: "es2017", // default, or 'es20XX', 'esnext'
            jsx: "transform", // default, or 'preserve'
            jsxFactory: "React.createElement",
            jsxFragment: "React.Fragment",
            // Like @rollup/plugin-replace
            define: {
                __VERSION__: '"x.y.z"',
            },
            tsconfig: "tsconfig.json", // default
            // Add extra loaders
            loaders: {
                // Add .json files support
                // require @rollup/plugin-commonjs
                ".json": "json",
                // Enable JSX in .js files too
                ".js": "jsx",
            },
        }),
    ],
};

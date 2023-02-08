import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import css from "rollup-plugin-css-only";
import alias from "@rollup/plugin-alias";
import dotenv from "rollup-plugin-dotenv";
import replace from "@rollup/plugin-replace";
// import { babel } from "@rollup/plugin-babel";
import { getBabelOutputPlugin } from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import path from "path";

const production = !process.env.ROLLUP_WATCH;
const projectRootDir = path.resolve(__dirname);

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require("child_process").spawn(
        "npm",
        ["run", "start", "--", "--dev"],
        {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        }
      );

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

export default {
  input: "src/main.ts",
  output: {
    sourcemap: true,
    format: "esm",
    name: "app",
    // file: "public/build/bundle.js",
    dir: "public/build",
    chunkFileNames: "[name].js",
    manualChunks: {
      three: ["three"],
      "regenerator-runtime": ["regenerator-runtime"],
    },
    // generatedCode: "es2015",
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess({
        sourceMap: !production,
        scss: { includePaths: ["src", "node_modules"] },
      }),
      compilerOptions: {
        hydratable: true,
        // enable run-time checks when not in production
        dev: !production,
      },
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: "bundle.css" }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
      extensions: [".ts", ".mjs", ".js", ".json", ".node"],
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
    commonjs(),
    typescript({
      sourceMap: !production,
      inlineSources: !production,
      include: "**/*.{js,ts}",
    }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
    alias({
      entries: [
        {
          find: "@",
          replacement: path.resolve(projectRootDir, "src"),
        },
      ],
    }),
    dotenv(),
    /* babel({
      extensions: [".ts", ".js"],
      babelHelpers: "bundled",
    }), */
    production &&
      getBabelOutputPlugin({
        presets: ["@babel/preset-env"],
        configFile: path.resolve(__dirname, "babel.config.json"),
      }),
    json(),
  ],
  watch: {
    clearScreen: false,
  },
};

import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript";
import clear from "rollup-plugin-clear";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "umd",
      name: "vividWait",
      // sourcemap: true,
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
    }
  ],
  plugins: [
    clear({ targets: ['dist'] }),
    resolve(),
    commonjs(),
    typescript(),
    babel({ babelHelpers: "bundled" }),
  ],
};

import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript";
import clear from "rollup-plugin-clear";
import { terser } from "rollup-plugin-terser";
import filesize from "rollup-plugin-filesize";
import pkg from "./package.json";

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
    },
    {
      file: pkg.module,
      format: "esm",
    },
    {
      file: pkg.browser,
      format: "umd",
      name: "vividWait",
    }
  ],
  plugins: [
    clear({ targets: ['lib', 'types'] }),
    resolve({
      preferBuiltins: true,
      main: true,
      brower: true,
    }),
    commonjs({
      include: /node_modules/,
    }),
    typescript(),
    babel({
      exclude: "node_modules/**" 
    }),
    terser(),
    filesize(),
  ],
};

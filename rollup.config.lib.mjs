import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/lite-element.ts', // replace this with the entry point to your library
  output: [
    {
      file: 'dist/lite.umd.js', // output file
      format: 'umd', // Universal Module Definition, works as amd, cjs, and iife all in one
      name: 'lite', // the name of the global variable for your library
      sourcemap: true,
    },
    {
      file: 'dist/lite.esm.js', // output file
      format: 'esm', // Universal Module Definition, works as amd, cjs, and iife all in one
      sourcemap: true,
    }
  ],
  plugins: [
    typescript(),
    resolve(),
    commonjs(),
    terser(), // minification
  ],
};

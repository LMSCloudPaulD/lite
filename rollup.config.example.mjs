import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'example/my-element.js',
  output: {
    file: 'example/dist/bundle.js',
    format: 'iife',
    name: 'exampleBundle',
    sourcemap: true,
  },
  plugins: [nodeResolve(), terser()],
};
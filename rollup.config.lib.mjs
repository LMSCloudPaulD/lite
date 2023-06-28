import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from "@rollup/plugin-terser";

export default [
  {
    input: 'src/lite-element.ts',
    output: [
      {
        file: 'dist/lite-element.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    external: ['lit'],
    plugins: [typescript(), nodeResolve(), terser()],
  },
];

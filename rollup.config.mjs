import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: `dist/konsole.js`,
      format: 'umd',
      name: "Konsole",
    },
    {
        file: `dist/konsole.cjs`,
        format: 'cjs',
        exports: 'auto',
    },
    {
        file: `dist/konsole.mjs`,
        format: 'esm',
    }
  ],
  plugins: [typescript()]
};
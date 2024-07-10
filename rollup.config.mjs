import typescript from '@rollup/plugin-typescript';

const pkgname = "konsole";

export default {
  input: 'src/index.ts',
  output: [
    {
      file: `dist/${pkgname}.js`,
      format: 'umd',
      name: "Konsole",
    },
    {
        file: `dist/${pkgname}.common.js`,
        format: 'cjs',
        exports: 'auto',
    },
    {
        file: `dist/${pkgname}.esm.js`,
        format: 'esm',
    }
  ],
  plugins: [typescript()]
};
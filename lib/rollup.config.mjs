import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json' assert { type: 'json' };

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  external: [Object.keys(pkg.peerDependencies || {})],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({
      useTsconfigDeclarationDir: true,
    }),
    terser(),
  ],
};

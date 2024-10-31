import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import url from '@rollup/plugin-url';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json' assert { type: 'json' };

export default {
  input: 'src/index.native.ts',
  output: [
    {
      file: pkg['react-native'],
      format: 'cjs',
      sourcemap: true,
      interop: 'compat',
    },
  ],
  external: [Object.keys(pkg.peerDependencies || {})],
  plugins: [
    commonjs(),
    peerDepsExternal(),
    resolve(),
    terser(),
    typescript({
      useTsconfigDeclarationDir: true,
    }),
    url({
      include: ['**/*.woff2'],
      fileName: 'fonts/[name][extname]',
      emitFiles: true,
      limit: 0,
    }),
  ],
};

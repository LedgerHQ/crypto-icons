import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.native.ts',
  output: [
    {
      file: 'dist/index.native.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.native.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  external: ['react', 'react-native'],
  plugins: [
    peerDepsExternal(),
    resolve({
      preferBuiltins: false,
    }),
    commonjs(),
    typescript({
      useTsconfigDeclarationDir: true,
    }),
    terser(),
  ],
};

import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'index.native': 'src/index.native.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  minify: true,
  clean: true,
  outExtensions: ({ format }) => ({
    js: format === 'cjs' ? '.js' : '.mjs',
  }),
});

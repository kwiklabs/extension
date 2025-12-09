import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    background: 'src/background.ts',
    popup: 'src/popup.ts',
  },
  format: ['iife'],
  target: 'es2020',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  minify: true,
  splitting: false,
  treeshake: true,
  platform: 'browser',
  external: ['chrome'],
  esbuildOptions(options) {
    options.banner = {
      js: '"use strict";',
    };
  },
});

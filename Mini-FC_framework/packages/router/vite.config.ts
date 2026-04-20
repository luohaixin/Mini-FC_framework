import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    mode: 'es',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['@mini-fc/core'],
      output: {
        globals: {
          '@mini-fc/core': 'MiniFC'
        }
      }
    },
    sourcemap: true,
    minify: false
  }
});

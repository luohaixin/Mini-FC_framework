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
      external: ['@my-framework/core'],
      output: {
        globals: {
          '@my-framework/core': 'MyFrameworkCore'
        }
      }
    },
    sourcemap: true,
    minify: false
  }
});

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
      external: ['@my-framework/core', '@vue/reactivity'],
      output: {
        globals: {
          '@my-framework/core': 'MyFramework',
          '@vue/reactivity': 'VueReactivity'
        }
      }
    },
    sourcemap: true,
    minify: false,
    cssCodeSplit: true
  }
});

import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    rollupOptions: {
      external: ['@my-framework/core', '@my-framework/router', '@mini-fc/store']
    }
  }
});

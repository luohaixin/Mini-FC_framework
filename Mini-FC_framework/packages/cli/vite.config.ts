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
      external: [
        'commander',
        'kolorist',
        'fs/promises',
        'fs',
        'path',
        'url',
        'child_process'
      ],
      output: {
        preserveModules: false
      }
    },
    sourcemap: true,
    minify: false,
    outDir: 'dist',
    ssr: true
  }
});

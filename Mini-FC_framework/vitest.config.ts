import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['packages/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '**/*.d.ts', '**/*.config.ts']
    }
  },
  resolve: {
    alias: {
      '@mini-fc/core': resolve(__dirname, 'packages/core/src/index.ts'),
      '@mini-fc/router': resolve(__dirname, 'packages/router/src/index.ts'),
      '@mini-fc/store': resolve(__dirname, 'packages/store/src/index.ts'),
      '@mini-fc/ui': resolve(__dirname, 'packages/ui/src/index.ts')
    }
  }
});

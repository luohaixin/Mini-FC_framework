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
      '@my-framework/core': resolve(__dirname, 'packages/core/src/index.ts'),
      '@my-framework/router': resolve(__dirname, 'packages/router/src/index.ts')
    }
  }
});

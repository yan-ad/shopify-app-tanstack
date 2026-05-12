import {defineConfig} from 'vitest/config';

export default defineConfig({
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  test: {
    globals: true,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    environmentMatchGlobs: [['src/react/**', 'jsdom']],
    server: {
      deps: {
        inline: ['@shopify/react-testing', 'react-reconciler'],
      },
    },
    setupFiles: ['./src/__tests__/setup-vitest.ts'],
  },
});

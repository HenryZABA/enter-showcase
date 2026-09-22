import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  root: fileURLToPath(new URL('../../', import.meta.url)),
  resolve: { alias: { '@': fileURLToPath(new URL('../../src', import.meta.url)) } },
  oxc: { jsx: { runtime: 'automatic' } },
  css: { postcss: { plugins: [] } },
  test: { environment: 'jsdom', include: ['.enter/performance-audit/*.test.{ts,tsx}'], testTimeout: 20000 },
});

// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Podem tenir tests de diferents tipus i entorns
    environment: 'node',
    environmentMatchGlobs: [
      // Tests de component / unit amb DOM simulat
      ['test/unit/**', 'happy-dom'],
      ['test/components/**', 'happy-dom'],

      // Tests E2E SSR (Nuxt + Nitro + @nuxt/test-utils/e2e)
      ['test/e2e/**', 'node'],
    ],

    globals: true,

    include: [
      'test/**/*.spec.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'test/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],

    exclude: [
      'node_modules',
      '.nuxt',
      'dist',
      '.output',
    ],

    reporters: 'default',
  },
})

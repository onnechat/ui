import { defineConfig, mergeConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      projects: [
        {
          extends: true,
          plugins: [
            storybookTest({
              configDir: path.join(dirname, '.storybook'),
              storybookScript: 'bun run dev -- --no-open',
            }),
          ],
          test: {
            name: 'storybook',
            browser: {
              enabled: true,
              provider: playwright({}),
              headless: true,
              instances: [{ browser: 'chromium' }],
            },
            coverage: {
              provider: 'v8',
              include: ['src/**/*.{ts,tsx}'],
              exclude: [
                'src/**/*.stories.*',
                'src/**/*.test.*',
                'src/**/*.spec.*',
                'src/components/internal/**',
                'src/types/**',
                'src/config/**',
                'src/constants/**',
              ],
            },
          },
        },
      ],
    },
  }),
)

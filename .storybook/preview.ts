import type { Preview } from '@storybook/react-vite';
import { withThemeByClassName } from '@storybook/addon-themes';

import '@/styles/globals.css';

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Introduction', 'UI', 'Charts', 'Blocks', 'Layouts', 'Products'],
      },
    },
    actions: {},
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
      story: {
        inline: true,
      },
    },
    backgrounds: {
      grid: {
        cellSize: 30,
        opacity: 0.1,
        cellAmount: 32,
      },
    },
    // Violações de acessibilidade falham as stories rodadas como teste
    // (addon-vitest). Use 'todo' por story para exceções ainda não corrigidas.
    a11y: {
      test: 'error',
    },
    layout: 'fullscreen',
  },
  initialGlobals: {
    backgrounds: { grid: true },
  },
  tags: ['autodocs'],
  decorators: [
    withThemeByClassName({
      themes: {
        Light: 'light',
        Dark: 'dark',
        Cream: 'cream',
        Claude: 'claude',
        Midnight: 'midnight',
        Matrix: 'matrix',
      },
      defaultTheme: 'Light',
      parentSelector: 'html',
    }),
  ],
};

export default preview;

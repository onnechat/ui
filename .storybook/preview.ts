import type { Preview } from '@storybook/react-vite';
import { withThemeByClassName } from '@storybook/addon-themes';

import '@/styles/globals.css';

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Products', 'Blocks', 'UI'],
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
      },
      defaultTheme: 'Light',
      parentSelector: 'html',
    }),
  ],
};

export default preview;

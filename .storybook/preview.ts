import type { Preview } from '@storybook/react-vite';
import { withThemeByClassName } from '@storybook/addon-themes';

import '@/styles/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
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
    backgrounds: { disabled: true },
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    withThemeByClassName({
      themes: {
        Light: 'light',
        Dark: 'dark',
      },
      defaultTheme: 'Dark',
      parentSelector: 'body',
    }),
  ],
};

export default preview;

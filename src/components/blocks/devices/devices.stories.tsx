import type { Meta, StoryObj } from '@storybook/react-vite';
import { Safari } from './safari';

const meta: Meta<typeof Safari> = {
  title: 'Blocks/Devices',
  component: Safari,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    url: {
      control: 'text',
      description: 'URL exibida na barra de endereço do navegador.',
      table: { category: 'Conteúdo' },
    },
    children: {
      control: false,
      description: 'Conteúdo renderizado dentro da janela do navegador.',
      table: { category: 'Conteúdo' },
    },
  },
  args: {
    url: 'https://example.com',
    children: (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Content area
      </div>
    ),
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const LongUrl: Story = {
  args: {
    url: 'https://subdomain.example.com/very/long/path/to/resource',
    children: (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Dashboard preview
      </div>
    ),
  },
};

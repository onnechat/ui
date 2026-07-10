import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { EmojiPicker } from './emoji-picker';

const meta: Meta<typeof EmojiPicker> = {
  title: 'UI/EmojiPicker',
  component: EmojiPicker,
  subcomponents: {
    'EmojiPicker.Search': EmojiPicker.Search,
    'EmojiPicker.CategorySelector': EmojiPicker.CategorySelector,
    'EmojiPicker.Viewport': EmojiPicker.Viewport,
    'EmojiPicker.Loading': EmojiPicker.Loading,
    'EmojiPicker.Empty': EmojiPicker.Empty,
    'EmojiPicker.List': EmojiPicker.List,
    'EmojiPicker.SkinToneSelector': EmojiPicker.SkinToneSelector,
    'EmojiPicker.Footer': EmojiPicker.Footer,
    'EmojiPicker.ActiveEmoji': EmojiPicker.ActiveEmoji,
  } as Meta<typeof EmojiPicker>['subcomponents'],
  parameters: {
    layout: 'centered',
    // TODO(a11y): a lista virtualizada do frimousse gera aria-rowindex="0" e
    // aria-colindex="0" (valores válidos começam em 1) — violação da lib
    // (EmojiPicker.List), afeta todas as stories que renderizam a lista.
    a11y: { test: 'todo' },
  },
  tags: ['autodocs', 'new'],
  argTypes: {
    onEmojiSelect: {
      control: false,
      description:
        'Callback disparado ao selecionar um emoji. Recebe `{ emoji, label, shortcodes, skinTone? }`.',
      table: { category: 'Estado' },
    },
    columns: {
      control: 'number',
      description: 'Número de colunas da grade de emojis.',
      table: { category: 'Aparência', defaultValue: { summary: '10' } },
    },
    locale: {
      control: 'select',
      options: ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'ko', 'zh'],
      description: 'Locale usado para buscar rótulos e categorias dos emojis.',
      table: { category: 'Comportamento', defaultValue: { summary: "'en'" } },
    },
    skinTone: {
      control: 'select',
      options: [
        'none',
        'light',
        'medium-light',
        'medium',
        'medium-dark',
        'dark',
      ],
      description: 'Tom de pele aplicado aos emojis que suportam variações.',
      table: { category: 'Aparência', defaultValue: { summary: "'none'" } },
    },
    sticky: {
      control: 'boolean',
      description: 'Mantém os cabeçalhos de categoria fixos durante o scroll.',
      table: { category: 'Aparência', defaultValue: { summary: 'true' } },
    },
    emojiVersion: {
      control: 'number',
      description:
        'Força uma versão específica do Emoji, independentemente do suporte do navegador.',
      table: { category: 'Comportamento' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao container raiz.',
      table: { category: 'Aparência' },
    },
    children: {
      control: false,
      description:
        'Composição livre de `EmojiPicker.Search`, `EmojiPicker.Viewport`, `EmojiPicker.List`, `EmojiPicker.Footer`, etc.',
      table: { category: 'Conteúdo' },
    },
  },
  args: {
    onEmojiSelect: fn(),
    columns: 10,
    locale: 'en',
    skinTone: 'none',
    sticky: true,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: args => (
    <EmojiPicker {...args}>
      <EmojiPicker.Search />
      <EmojiPicker.Viewport>
        <EmojiPicker.Loading />
        <EmojiPicker.Empty />
        <EmojiPicker.List />
      </EmojiPicker.Viewport>
    </EmojiPicker>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const search = canvas.getByPlaceholderText('Search emoji...');
    await userEvent.type(search, 'pizza');

    // A lista carrega os dados do Emojibase de forma assíncrona.
    const pizza = await canvas.findByRole(
      'gridcell',
      { name: /^pizza$/i },
      { timeout: 10000 },
    );
    await userEvent.click(pizza);
    await expect(args.onEmojiSelect).toHaveBeenCalled();
  },
};

export const WithFooter: Story = {
  render: args => (
    <EmojiPicker {...args}>
      <EmojiPicker.Search />
      <EmojiPicker.Viewport>
        <EmojiPicker.Loading />
        <EmojiPicker.Empty />
        <EmojiPicker.List />
      </EmojiPicker.Viewport>
      <EmojiPicker.Footer>
        <EmojiPicker.SkinToneSelector />
        <EmojiPicker.ActiveEmoji>
          {({ emoji }) => (
            <span>
              {emoji ? `${emoji.emoji} ${emoji.label}` : 'Pick an emoji'}
            </span>
          )}
        </EmojiPicker.ActiveEmoji>
      </EmojiPicker.Footer>
    </EmojiPicker>
  ),
};

export const WithCategorySelector: Story = {
  render: args => (
    <EmojiPicker {...args}>
      <EmojiPicker.Search />
      <EmojiPicker.CategorySelector />
      <EmojiPicker.Viewport>
        <EmojiPicker.Loading />
        <EmojiPicker.Empty />
        <EmojiPicker.List />
      </EmojiPicker.Viewport>
      <EmojiPicker.Footer>
        <EmojiPicker.SkinToneSelector />
        <EmojiPicker.ActiveEmoji>
          {({ emoji }) => (
            <span>
              {emoji ? `${emoji.emoji} ${emoji.label}` : 'Pick an emoji'}
            </span>
          )}
        </EmojiPicker.ActiveEmoji>
      </EmojiPicker.Footer>
    </EmojiPicker>
  ),
};

export const Compact: Story = {
  args: {
    className: 'h-72',
    columns: 8,
  },
  render: args => (
    <EmojiPicker {...args}>
      <EmojiPicker.Search />
      <EmojiPicker.Viewport>
        <EmojiPicker.List />
      </EmojiPicker.Viewport>
    </EmojiPicker>
  ),
};

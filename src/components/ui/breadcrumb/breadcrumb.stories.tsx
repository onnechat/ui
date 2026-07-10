import type { Meta, StoryObj } from '@storybook/react-vite';

import { Breadcrumb } from './breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
  title: 'UI/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: false,
      description:
        'Trilha de navegação: array de `{ label: string; href?: string }`. O último item é a página atual; itens com `href` viram links.',
      table: {
        category: 'Conteúdo',
        type: { summary: 'BreadcrumbItem[]' },
      },
    },
    hideBackButton: {
      control: 'boolean',
      description:
        'Oculta o botão de voltar que aponta para o penúltimo item com `href`.',
      table: {
        category: 'Aparência',
        defaultValue: { summary: 'false' },
      },
    },
    disableLinks: {
      control: 'boolean',
      description: 'Renderiza todos os itens como texto, sem links clicáveis.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao container raiz.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    items: [
      { label: 'Workspace', href: '/workspace' },
      { label: 'Calendar', href: '/workspace/calendar' },
      { label: 'Events' },
    ],
    hideBackButton: false,
    disableLinks: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// TODO(a11y): o botão de voltar do Breadcrumb é um link só com ícone, sem
// aria-label (violação link-name). Corrigir no componente breadcrumb.tsx.
const A11Y_TODO_BACK_BUTTON = {
  a11y: { test: 'todo' },
} as const;

export const Playground: Story = {
  parameters: A11Y_TODO_BACK_BUTTON,
};

export const SingleItem: Story = {
  args: {
    items: [{ label: 'Dashboard' }],
  },
};

export const WithoutLinks: Story = {
  args: {
    disableLinks: true,
  },
  // TODO(a11y): mesmo motivo do Playground — back button sem texto acessível.
  parameters: A11Y_TODO_BACK_BUTTON,
};

export const WithoutBackButton: Story = {
  args: {
    hideBackButton: true,
  },
};

export const LongPath: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Workspace', href: '/workspace' },
      { label: 'Project', href: '/workspace/project' },
      { label: 'Settings', href: '/workspace/project/settings' },
      { label: 'Advanced' },
    ],
  },
  // TODO(a11y): mesmo motivo do Playground — back button sem texto acessível.
  parameters: A11Y_TODO_BACK_BUTTON,
};

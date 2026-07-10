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
    backAriaLabel: {
      control: 'text',
      description:
        'Nome acessível (`aria-label`) do link de voltar, que exibe apenas um ícone.',
      table: {
        category: 'Acessibilidade',
        defaultValue: { summary: "'Back'" },
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

export const Playground: Story = {};

export const SingleItem: Story = {
  args: {
    items: [{ label: 'Dashboard' }],
  },
};

export const WithoutLinks: Story = {
  args: {
    disableLinks: true,
  },
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
};

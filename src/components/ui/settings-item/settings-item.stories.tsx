import type { ComponentType } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { SettingsItem } from './settings-item';

const meta: Meta<typeof SettingsItem> = {
  title: 'UI/SettingsItem',
  component: SettingsItem,
  subcomponents: {
    'SettingsItem.Row': (SettingsItem as unknown as { Row: ComponentType }).Row,
  } as Meta<typeof SettingsItem>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['ai-generated'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Título do item de configuração.',
      table: { category: 'Conteúdo' },
    },
    description: {
      control: 'text',
      description: 'Texto auxiliar exibido abaixo do título.',
      table: { category: 'Conteúdo' },
    },
    icon: {
      control: 'select',
      options: ['Bell', 'User', 'Lock', 'Gear', 'House', 'UserGroup'],
      description:
        'Nome do ícone exibido à esquerda (subconjunto — veja a galeria em UI/Icons para todos os nomes).',
      table: { category: 'Conteúdo' },
    },
    action: {
      control: false,
      description:
        'Elemento de ação exibido à direita (switch, botão, texto, etc.).',
      table: { category: 'Conteúdo' },
    },
    variant: {
      control: 'select',
      options: ['row', 'card'],
      description: 'Estilo do container: linha simples ou card com fundo.',
      table: {
        category: 'Aparência',
        type: { summary: "'row' | 'card'" },
        defaultValue: { summary: "'row'" },
      },
    },
    align: {
      control: 'select',
      options: ['center', 'start'],
      description: 'Alinhamento vertical do conteúdo.',
      table: {
        category: 'Aparência',
        type: { summary: "'center' | 'start'" },
        defaultValue: { summary: "'start'" },
      },
    },
    as: {
      control: 'inline-radio',
      options: ['div', 'button'],
      description: 'Elemento raiz renderizado.',
      table: { category: 'Comportamento', defaultValue: { summary: "'div'" } },
    },
    id: {
      control: 'text',
      description:
        'Quando definido, o título vira um `Label` com `htmlFor` apontando para este id.',
      table: { category: 'Comportamento' },
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita o item (opacidade reduzida e sem interação).',
      table: { category: 'Estado', defaultValue: { summary: 'false' } },
    },
    collapse: {
      control: false,
      description:
        'Transforma o item em um collapsible: a linha vira o trigger e `collapse.children` vira o painel expansível.',
      table: { category: 'Comportamento' },
    },
    collapsibleTrigger: {
      control: false,
      description:
        'Usa o item como trigger de um `<Collapsible>` ancestral (composição manual).',
      table: { category: 'Comportamento' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao container.',
      table: { category: 'Aparência' },
    },
    titleClassName: {
      control: 'text',
      description: 'Classes extras aplicadas ao título.',
      table: { category: 'Aparência' },
    },
    descriptionClassName: {
      control: 'text',
      description: 'Classes extras aplicadas à descrição.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    title: 'Notifications',
    description: 'Manage your notification preferences.',
    variant: 'row',
    align: 'start',
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithIcon: Story = {
  args: {
    icon: 'Bell',
    title: 'Notifications',
    description: 'Receive push and email notifications.',
  },
};

export const WithAction: Story = {
  args: {
    icon: 'User',
    title: 'Account',
    description: 'Update your account details.',
    action: <span className="text-sm text-muted-foreground">Manage</span>,
  },
};

export const CardVariant: Story = {
  args: {
    variant: 'card',
    title: 'Security',
    description: 'Two-factor authentication and password settings.',
    icon: 'Lock',
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';

import { EmptyState } from './empty-state';
import type { IconType } from '@/components/icon';
import { fillIcons } from '@/components/icon/variants';
import { Button } from '@/components/ui/button';

const ICON_OPTIONS = Object.keys(fillIcons).sort() as IconType[];

const meta: Meta<typeof EmptyState> = {
  title: 'UI/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'embedded', 'flat'],
      description:
        'Apresentação do container: card padrão, embutido (sem padding externo) ou plano (sem fundo).',
      table: {
        category: 'Aparência',
        type: { summary: "'default' | 'embedded' | 'flat'" },
        defaultValue: { summary: "'default'" },
      },
    },
    icon: {
      control: 'select',
      options: ICON_OPTIONS,
      description: 'Ícone exibido no topo do estado vazio.',
      table: {
        category: 'Conteúdo',
        defaultValue: { summary: "'Archive'" },
      },
    },
    title: {
      control: 'text',
      description: 'Título do estado vazio.',
      table: { category: 'Conteúdo' },
    },
    description: {
      control: 'text',
      description: 'Texto auxiliar exibido abaixo do título.',
      table: { category: 'Conteúdo' },
    },
    children: {
      control: false,
      description: 'Conteúdo extra, como um botão de ação.',
      table: { category: 'Conteúdo' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao conteúdo do card.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    variant: 'default',
    icon: 'Archive',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    icon: 'Magnifier',
    title: 'No results found',
    description: 'Try adjusting your search or filters.',
  },
};

export const IconDescription: Story = {
  args: {
    icon: 'Archive',
    description: 'Create your first project to get started.',
  },
};

export const IconTitle: Story = {
  args: {
    icon: 'Archive',
    title: 'No projects yet',
  },
};

export const TitleDescription: Story = {
  args: {
    title: 'No projects yet',
    description: 'Create your first project to get started.',
  },
};

export const WithAction: Story = {
  args: {
    icon: 'Archive',
    title: 'No projects yet',
    description: 'Create your first project to get started.',
    children: <Button>Create project</Button>,
  },
};

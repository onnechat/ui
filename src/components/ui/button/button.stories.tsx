import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Button } from './button';
import { Icon } from '@/components/icon';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'success',
        'outline',
        'primary',
        'secondary',
        'ghost',
        'link',
      ],
      description: 'Estilo visual do botão.',
      table: {
        category: 'Aparência',
        type: {
          summary:
            "'default' | 'destructive' | 'success' | 'outline' | 'primary' | 'secondary' | 'ghost' | 'link'",
        },
        defaultValue: { summary: "'default'" },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'icon-sm', 'icon'],
      description:
        'Tamanho do botão. As opções `icon-sm` e `icon` produzem botões quadrados para uso somente com ícone.',
      table: {
        category: 'Aparência',
        type: { summary: "'sm' | 'default' | 'lg' | 'icon-sm' | 'icon'" },
        defaultValue: { summary: "'default'" },
      },
    },
    isLoading: {
      control: 'boolean',
      description:
        'Exibe um loader no lugar do conteúdo e desabilita o botão, preservando as dimensões atuais.',
      table: {
        category: 'Estado',
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Desabilita o botão.',
      table: {
        category: 'Estado',
        defaultValue: { summary: 'false' },
      },
    },
    asChild: {
      control: 'boolean',
      description:
        'Renderiza o elemento filho como raiz do botão (ex.: um `<a>`), mesclando as props. Requer um único elemento React como filho.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: 'false' },
      },
    },
    onClick: {
      control: false,
      description: 'Callback disparado ao clicar no botão.',
      table: { category: 'Comportamento' },
    },
    children: {
      control: 'text',
      description: 'Conteúdo do botão.',
      table: { category: 'Conteúdo' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao botão.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
    disabled: false,
    isLoading: false,
    asChild: false,
    onClick: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button');

    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Variants: Story = {
  // TODO(a11y): as cores das variantes primary/destructive/success/link não
  // atingem contraste 4.5:1 no tema atual — corrigir tokens no tema/componente.
  parameters: { a11y: { test: 'todo' } },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="success">Success</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const IconSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="icon-sm" aria-label="Light theme">
        <Icon name="Sun" />
      </Button>
      <Button size="icon" aria-label="Dark theme">
        <Icon name="Moon" />
      </Button>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm">
        <Icon name="Plus" />
        Add Item
      </Button>
      <Button size="default">
        <Icon name="Plus" />
        Add Item
      </Button>
      <Button size="lg">
        <Icon name="Plus" />
        Add Item
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button isLoading>Default</Button>
      <Button isLoading variant="destructive">
        Destructive
      </Button>
      <Button isLoading variant="outline">
        Outline
      </Button>
      <Button isLoading variant="primary">
        Primary
      </Button>
      <Button isLoading variant="secondary">
        Secondary
      </Button>
      <Button isLoading variant="ghost">
        Ghost
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button disabled>Default</Button>
      <Button disabled variant="destructive">
        Destructive
      </Button>
      <Button disabled variant="success">
        Success
      </Button>
      <Button disabled variant="outline">
        Outline
      </Button>
      <Button disabled variant="primary">
        Primary
      </Button>
      <Button disabled variant="secondary">
        Secondary
      </Button>
      <Button disabled variant="ghost">
        Ghost
      </Button>
      <Button disabled variant="link">
        Link
      </Button>
    </div>
  ),
};

export const AsChild: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button asChild>
        <a href="#">Link Button</a>
      </Button>
      <Button asChild variant="secondary">
        <a href="#">Secondary Link</a>
      </Button>
    </div>
  ),
};

import * as React from 'react';
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
      options: ['sm', 'default', 'lg', 'icon-sm', 'icon', 'icon-lg'],
      description:
        'Tamanho do botão. As opções `icon-sm`, `icon` e `icon-lg` produzem botões quadrados para uso somente com ícone.',
      table: {
        category: 'Aparência',
        type: {
          summary: "'sm' | 'default' | 'lg' | 'icon-sm' | 'icon' | 'icon-lg'",
        },
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
      <Button size="icon-lg" aria-label="System theme">
        <Icon name="Monitor" />
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

/**
 * Todas as variantes em loading, num grid de largura uniforme para comparar o
 * loader sem a distração de larguras diferentes.
 */
export const Loading: Story = {
  render: () => (
    <div className="grid w-[26rem] grid-cols-2 gap-3">
      <Button className="w-full" isLoading>
        Default
      </Button>
      <Button className="w-full" variant="destructive" isLoading>
        Destructive
      </Button>
      <Button className="w-full" variant="outline" isLoading>
        Outline
      </Button>
      <Button className="w-full" variant="primary" isLoading>
        Primary
      </Button>
      <Button className="w-full" variant="secondary" isLoading>
        Secondary
      </Button>
      <Button className="w-full" variant="ghost" isLoading>
        Ghost
      </Button>
    </div>
  ),
};

/**
 * O loading preserva o tamanho do botão: cada par (repouso / carregando) tem a
 * mesma largura, então o loader só substitui o conteúdo — nada encolhe. Os
 * botões de ícone usam os três tamanhos; os de texto ficam num grid uniforme.
 */
export const LoadingKeepsSize: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Button size="icon-sm" aria-label="Atualizar">
          <Icon name="Refresh" />
        </Button>
        <Button size="icon-sm" aria-label="Atualizando" isLoading>
          <Icon name="Refresh" />
        </Button>
        <Button size="icon" aria-label="Atualizar">
          <Icon name="Refresh" />
        </Button>
        <Button size="icon" aria-label="Atualizando" isLoading>
          <Icon name="Refresh" />
        </Button>
        <Button size="icon-lg" aria-label="Atualizar">
          <Icon name="Refresh" />
        </Button>
        <Button size="icon-lg" aria-label="Atualizando" isLoading>
          <Icon name="Refresh" />
        </Button>
      </div>

      <div className="grid w-[26rem] grid-cols-2 gap-3">
        <Button className="w-full">
          <Icon name="Check" />
          Salvar alterações
        </Button>
        <Button className="w-full" isLoading>
          <Icon name="Check" />
          Salvar alterações
        </Button>
        <Button className="w-full" variant="secondary">
          Publicar
        </Button>
        <Button className="w-full" variant="secondary" isLoading>
          Publicar
        </Button>
      </div>
    </div>
  ),
};

/**
 * Botão que entra em loading ao ser clicado e volta sozinho após `resetAfter`
 * ms — usado para testar a transição de ida e volta. Fica desabilitado durante
 * o loading, então não há como reclicar antes de terminar.
 */
function AutoLoadingButton({
  resetAfter = 2000,
  onClick,
  ...props
}: React.ComponentProps<typeof Button> & { resetAfter?: number }) {
  const [loading, setLoading] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  React.useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <Button
      {...props}
      isLoading={loading}
      onClick={e => {
        onClick?.(e);
        setLoading(true);
        timerRef.current = setTimeout(() => setLoading(false), resetAfter);
      }}
    />
  );
}

/**
 * Cada botão tem seu próprio loading: clique para iniciar e ele volta sozinho
 * depois de 1–3s. A transição é uma esteira vertical — ao carregar o loader
 * desce (entra por cima) e o conteúdo desce (sai por baixo); ao terminar o
 * loader sobe (sai por cima) e o conteúdo volta de baixo para o lugar.
 */
export const LoadingToggle: Story = {
  name: 'Loading (auto-reset)',
  render: () => (
    <div className="flex flex-col items-center gap-3">
      <div className="grid w-[26rem] grid-cols-2 gap-3">
        <AutoLoadingButton className="w-full" resetAfter={1000}>
          <Icon name="Rocket" />
          Enviar (1s)
        </AutoLoadingButton>
        <AutoLoadingButton
          className="w-full"
          variant="secondary"
          resetAfter={2000}
        >
          Processar (2s)
        </AutoLoadingButton>
        <AutoLoadingButton
          className="w-full"
          variant="outline"
          resetAfter={3000}
        >
          Salvar (3s)
        </AutoLoadingButton>
        <AutoLoadingButton
          className="w-full"
          variant="ghost"
          resetAfter={2000}
        >
          <Icon name="Refresh" />
          Sincronizar (2s)
        </AutoLoadingButton>
      </div>

      <div className="flex items-center gap-3">
        <AutoLoadingButton
          size="icon-sm"
          aria-label="Atualizar"
          resetAfter={1000}
        >
          <Icon name="Refresh" />
        </AutoLoadingButton>
        <AutoLoadingButton size="icon" aria-label="Atualizar" resetAfter={2000}>
          <Icon name="Refresh" />
        </AutoLoadingButton>
        <AutoLoadingButton
          size="icon-lg"
          aria-label="Atualizar"
          resetAfter={3000}
        >
          <Icon name="Refresh" />
        </AutoLoadingButton>
      </div>
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

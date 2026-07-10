import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Avatar } from './avatar';

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  subcomponents: {
    'Avatar.Image': Avatar.Image,
    'Avatar.Fallback': Avatar.Fallback,
  } as Meta<typeof Avatar>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description: 'Composição com `Avatar.Image` e `Avatar.Fallback`.',
      table: { category: 'Conteúdo' },
    },
    className: {
      control: 'text',
      description:
        'Classes extras aplicadas ao container (ex.: `size-12`, `rounded-full`).',
      table: { category: 'Aparência' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const IMG = 'https://github.com/shadcn.png';

type PlaygroundArgs = ComponentProps<typeof Avatar> & {
  src?: string;
  name?: string;
};

export const Playground: StoryObj<PlaygroundArgs> = {
  argTypes: {
    src: {
      control: 'text',
      description:
        'URL da imagem (`Avatar.Image`). Deixe vazio para ver o fallback.',
      table: { category: 'Conteúdo' },
    },
    name: {
      control: 'text',
      description:
        'Nome usado para gerar as iniciais do fallback (`Avatar.Fallback`).',
      table: { category: 'Conteúdo' },
    },
  },
  args: {
    src: IMG,
    name: 'Shadcn',
  },
  render: ({ src, name, ...args }) => (
    <Avatar {...args}>
      <Avatar.Image src={src} />
      <Avatar.Fallback name={name} />
    </Avatar>
  ),
};

export const Initials: Story = {
  // TODO(a11y): o fallback usa bg-primary/text-primary-foreground com
  // contraste < 4.5:1 — corrigir tokens no componente/tema.
  parameters: { a11y: { test: 'todo' } },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Avatar>
        <Avatar.Fallback name="John Doe" />
      </Avatar>
      <Avatar>
        <Avatar.Fallback name="Maria Silva" />
      </Avatar>
      <Avatar>
        <Avatar.Fallback name="Single" />
      </Avatar>
    </div>
  ),
};

export const CustomFallback: Story = {
  // TODO(a11y): o fallback usa bg-primary/text-primary-foreground com
  // contraste < 4.5:1 — corrigir tokens no componente/tema.
  parameters: { a11y: { test: 'todo' } },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Avatar>
        <Avatar.Image src="/broken.png" />
        <Avatar.Fallback>JD</Avatar.Fallback>
      </Avatar>
      <Avatar className="bg-destructive text-destructive-foreground">
        <Avatar.Image src="/broken.png" />
        <Avatar.Fallback>!!</Avatar.Fallback>
      </Avatar>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {[6, 8, 10, 12, 14].map(size => (
        <Avatar key={size} className={`size-${size}`}>
          <Avatar.Image src={IMG} />
          <Avatar.Fallback name="Shadcn">S</Avatar.Fallback>
        </Avatar>
      ))}
    </div>
  ),
};

export const Group: Story = {
  // TODO(a11y): o fallback usa bg-primary/text-primary-foreground com
  // contraste < 4.5:1 — corrigir tokens no componente/tema.
  parameters: { a11y: { test: 'todo' } },
  render: () => (
    <div className="flex -space-x-2">
      {['John Doe', 'Maria Silva', 'Bob Lee', 'Ana Costa'].map((name, i) => (
        <Avatar key={name} className="ring-2 ring-background">
          <Avatar.Image src={i === 0 ? IMG : '/broken.png'} />
          <Avatar.Fallback name={name} />
        </Avatar>
      ))}
    </div>
  ),
};

export const RoundedGroup: Story = {
  // TODO(a11y): o fallback usa bg-primary/text-primary-foreground com
  // contraste < 4.5:1 — corrigir tokens no componente/tema.
  parameters: { a11y: { test: 'todo' } },
  render: () => (
    <div className="flex -space-x-2">
      {['John Doe', 'Maria Silva', 'Bob Lee', 'Ana Costa'].map((name, i) => (
        <Avatar key={name} className="ring-2 ring-background rounded-full">
          <Avatar.Image src={i === 0 ? IMG : '/broken.png'} />
          <Avatar.Fallback name={name} />
        </Avatar>
      ))}
    </div>
  ),
};

export const WithStatusIndicator: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <div className="relative">
        <Avatar>
          <Avatar.Image src={IMG} />
          <Avatar.Fallback name="Online" />
        </Avatar>
        <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-background bg-success" />
      </div>
      <div className="relative">
        <Avatar>
          <Avatar.Image src="/broken.png" />
          <Avatar.Fallback name="Away" />
        </Avatar>
        <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-background bg-warning" />
      </div>
      <div className="relative">
        <Avatar>
          <Avatar.Image src="/broken.png" />
          <Avatar.Fallback name="Offline" />
        </Avatar>
        <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-background bg-muted-foreground" />
      </div>
    </div>
  ),
};

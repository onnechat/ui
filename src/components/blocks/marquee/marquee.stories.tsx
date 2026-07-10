import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Marquee,
  MarqueeContent,
  type MarqueeContentProps,
  MarqueeFade,
  MarqueeItem,
  type MarqueeProps,
} from './marquee';

// O Marquee raiz é só o container; as props de animação vivem no
// MarqueeContent. O Playground junta as duas camadas em um único set de args.
type PlaygroundArgs = MarqueeProps &
  Pick<
    MarqueeContentProps,
    'autoFill' | 'direction' | 'loop' | 'pauseOnHover' | 'speed'
  >;

const meta: Meta<PlaygroundArgs> = {
  title: 'Blocks/Marquee',
  component: Marquee,
  subcomponents: {
    MarqueeContent,
    MarqueeFade,
    MarqueeItem,
  } as Meta<typeof Marquee>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    speed: {
      control: { type: 'range', min: 10, max: 200, step: 10 },
      description: 'Velocidade de rolagem, em px/s (`MarqueeContent`).',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: '50' },
      },
    },
    direction: {
      control: 'select',
      options: ['left', 'right', 'up', 'down'],
      description: 'Direção da rolagem (`MarqueeContent`).',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: "'left'" },
      },
    },
    pauseOnHover: {
      control: 'boolean',
      description: 'Pausa a rolagem enquanto o cursor está sobre o conteúdo.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: 'true' },
      },
    },
    autoFill: {
      control: 'boolean',
      description: 'Duplica os itens até preencher toda a largura disponível.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: 'true' },
      },
    },
    loop: {
      control: 'number',
      description: 'Número de ciclos da animação; `0` repete indefinidamente.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: '0' },
      },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao container raiz.',
      table: { category: 'Aparência' },
    },
    children: {
      control: false,
      description:
        'Composição com `MarqueeContent`, `MarqueeFade` e `MarqueeItem`.',
      table: { category: 'Conteúdo' },
    },
  },
  args: {
    className: 'w-full max-w-xl',
    speed: 50,
    direction: 'left',
    pauseOnHover: true,
    autoFill: true,
    loop: 0,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Logos = () => (
  <>
    {[
      'React',
      'Vue',
      'Svelte',
      'Angular',
      'Next.js',
      'Nuxt',
      'Remix',
      'Astro',
    ].map(name => (
      <MarqueeItem key={name}>
        <div className="flex h-16 w-28 items-center justify-center rounded-lg border bg-card text-sm font-medium text-card-foreground">
          {name}
        </div>
      </MarqueeItem>
    ))}
  </>
);

export const Playground: Story = {
  render: ({ autoFill, direction, loop, pauseOnHover, speed, ...props }) => (
    <Marquee {...props}>
      <MarqueeContent
        autoFill={autoFill}
        direction={direction}
        loop={loop}
        pauseOnHover={pauseOnHover}
        speed={speed}
      >
        <Logos />
      </MarqueeContent>
    </Marquee>
  ),
};

export const WithFade: Story = {
  render: () => (
    <Marquee className="w-full max-w-xl">
      <MarqueeContent>
        <Logos />
      </MarqueeContent>
      <MarqueeFade side="left" />
      <MarqueeFade side="right" />
    </Marquee>
  ),
};

export const Reverse: Story = {
  render: () => (
    <Marquee className="w-full max-w-xl">
      <MarqueeContent direction="right">
        <Logos />
      </MarqueeContent>
    </Marquee>
  ),
};

export const Speed: Story = {
  render: () => (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <div className="rounded-lg border bg-muted/30 py-2">
        <Marquee>
          <MarqueeContent speed={20}>
            <Logos />
          </MarqueeContent>
        </Marquee>
      </div>
      <div className="rounded-lg border bg-muted/30 py-2">
        <Marquee>
          <MarqueeContent speed={60}>
            <Logos />
          </MarqueeContent>
        </Marquee>
      </div>
      <div className="rounded-lg border bg-muted/30 py-2">
        <Marquee>
          <MarqueeContent speed={120}>
            <Logos />
          </MarqueeContent>
        </Marquee>
      </div>
    </div>
  ),
};

export const WithLinks: Story = {
  render: () => (
    <Marquee className="w-full max-w-xl">
      <MarqueeContent>
        <MarqueeItem href="https://react.dev">
          <div className="flex h-12 w-24 items-center justify-center rounded-lg border bg-card text-sm font-medium text-card-foreground hover:bg-accent">
            React
          </div>
        </MarqueeItem>
        <MarqueeItem href="https://vuejs.org">
          <div className="flex h-12 w-24 items-center justify-center rounded-lg border bg-card text-sm font-medium text-card-foreground hover:bg-accent">
            Vue
          </div>
        </MarqueeItem>
        <MarqueeItem href="https://svelte.dev">
          <div className="flex h-12 w-24 items-center justify-center rounded-lg border bg-card text-sm font-medium text-card-foreground hover:bg-accent">
            Svelte
          </div>
        </MarqueeItem>
        <MarqueeItem href="https://angular.dev">
          <div className="flex h-12 w-24 items-center justify-center rounded-lg border bg-card text-sm font-medium text-card-foreground hover:bg-accent">
            Angular
          </div>
        </MarqueeItem>
        <MarqueeItem href="https://nextjs.org">
          <div className="flex h-12 w-24 items-center justify-center rounded-lg border bg-card text-sm font-medium text-card-foreground hover:bg-accent">
            Next.js
          </div>
        </MarqueeItem>
        <MarqueeItem href="https://astro.build">
          <div className="flex h-12 w-24 items-center justify-center rounded-lg border bg-card text-sm font-medium text-card-foreground hover:bg-accent">
            Astro
          </div>
        </MarqueeItem>
      </MarqueeContent>
    </Marquee>
  ),
};

export const Gradient: Story = {
  render: () => (
    <Marquee className="w-full max-w-xl">
      <MarqueeContent
        gradient
        gradientColor="var(--color-background)"
        gradientWidth={100}
      >
        <Logos />
      </MarqueeContent>
    </Marquee>
  ),
};

export const PauseOnHover: Story = {
  render: () => (
    <Marquee className="w-full max-w-xl">
      <MarqueeContent pauseOnHover>
        <Logos />
      </MarqueeContent>
      <MarqueeFade side="left" />
      <MarqueeFade side="right" />
    </Marquee>
  ),
};

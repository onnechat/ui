import type { Meta, StoryObj } from '@storybook/react-vite';

import { OnneLogo } from '@/components/ui/logo/onne/logo';

const Wrapper = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) => (
  <div
    style={{
      padding: '24px',
      borderRadius: '12px',
      background: 'var(--card)',
    }}
  >
    <span
      style={{
        fontSize: '12px',
        color: 'var(--muted-foreground)',
        display: 'block',
        marginBottom: '16px',
      }}
    >
      {label}
    </span>
    {children}
  </div>
);

const meta: Meta<typeof OnneLogo> = {
  title: 'Products/Onne/Logo',
  component: OnneLogo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Logo da Onne em SVG. O ícone usa o gradiente da marca e o texto herda `currentColor` (`text-foreground`), acompanhando o tema.',
      },
    },
  },
  tags: ['autodocs'],
  // Showcase estático: a story exibe as três variantes lado a lado, então os
  // controls ficam desligados — a tabela de props documenta a API.
  argTypes: {
    variant: {
      control: false,
      description:
        'Composição do logo: ícone + texto (`default`), só o ícone ou só o texto.',
      table: {
        category: 'Aparência',
        type: { summary: "'default' | 'icon' | 'text'" },
        defaultValue: { summary: "'default'" },
      },
    },
    className: {
      control: false,
      description: 'Classes extras aplicadas ao `<svg>` raiz.',
      table: { category: 'Aparência' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** As três variantes (`default`, `icon` e `text`) lado a lado. */
export const Default: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '32px',
        maxWidth: '400px',
      }}
    >
      <Wrapper label="Default">
        <OnneLogo />
      </Wrapper>
      <Wrapper label="Icon">
        <OnneLogo variant="icon" />
      </Wrapper>
      <Wrapper label="Text">
        <OnneLogo variant="text" />
      </Wrapper>
    </div>
  ),
};

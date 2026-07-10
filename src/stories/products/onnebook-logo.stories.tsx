import type { Meta, StoryObj } from '@storybook/react-vite';

import { OnnebookLogo } from '@/components/ui/logo/onnebook/logo';

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

const meta: Meta<typeof OnnebookLogo> = {
  title: 'Products/Onnebook/Logo',
  component: OnnebookLogo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Logo do Onnebook: ícone SVG (colorido pelos tokens `primary`/`primary-foreground` do tema) e wordmark em texto.',
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
      description: 'Classes extras aplicadas ao container do logo.',
      table: { category: 'Aparência' },
    },
    classNames: {
      control: false,
      description:
        'Classes por parte do logo: `{ icon?: { container?, path? }, text? }`.',
      table: { category: 'Aparência' },
    },
    style: {
      control: false,
      description: 'Estilos inline aplicados ao container do logo.',
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
        <OnnebookLogo />
      </Wrapper>
      <Wrapper label="Icon Only">
        <OnnebookLogo variant="icon" />
      </Wrapper>
      <Wrapper label="Text Only">
        <OnnebookLogo variant="text" />
      </Wrapper>
    </div>
  ),
};

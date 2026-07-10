import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Alert } from './alert';
import { Icon, type IconType } from '@/components/icon';
import { fillIcons } from '@/components/icon/variants';

const ICON_OPTIONS: (IconType | null)[] = [
  null,
  ...(Object.keys(fillIcons).sort() as IconType[]),
];

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  subcomponents: {
    'Alert.Title': Alert.Title,
    'Alert.Description': Alert.Description,
  } as Meta<typeof Alert>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'warning', 'info', 'success'],
      description: 'Estilo visual do alerta.',
      table: {
        category: 'Aparência',
        type: {
          summary: "'default' | 'destructive' | 'warning' | 'info' | 'success'",
        },
        defaultValue: { summary: "'default'" },
      },
    },
    children: {
      control: false,
      description:
        'Composição com um ícone opcional, `Alert.Title` e `Alert.Description`.',
      table: { category: 'Conteúdo' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao container do alerta.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    variant: 'default',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

type PlaygroundArgs = ComponentProps<typeof Alert> & {
  iconType?: IconType | null;
  title?: string;
  description?: string;
};

export const Playground: StoryObj<PlaygroundArgs> = {
  argTypes: {
    iconType: {
      control: 'select',
      options: ICON_OPTIONS,
      description: 'Ícone exibido no início do alerta.',
      table: { category: 'Conteúdo' },
    },
    title: {
      control: 'text',
      description: 'Texto do `Alert.Title`.',
      table: { category: 'Conteúdo' },
    },
    description: {
      control: 'text',
      description: 'Texto do `Alert.Description`.',
      table: { category: 'Conteúdo' },
    },
  },
  args: {
    variant: 'default',
    iconType: 'CircleInfo' as IconType | null,
    title: 'Alert Title',
    description: 'This is the alert description text.',
  },
  render: ({ iconType, title, description, ...args }) => (
    <Alert {...args}>
      {iconType && <Icon name={iconType} />}
      {title && <Alert.Title>{title}</Alert.Title>}
      {description && <Alert.Description>{description}</Alert.Description>}
    </Alert>
  ),
};

export const Destructive: Story = {
  // TODO(a11y): as cores da variante destructive (texto destructive sobre
  // bg-destructive/5) não atingem contraste 4.5:1 — corrigir tokens no
  // componente/tema.
  parameters: { a11y: { test: 'todo' } },
  args: { variant: 'destructive' },
  render: args => (
    <Alert {...args}>
      <Icon name="TriangleWarning" />
      <Alert.Title>Account suspended</Alert.Title>
      <Alert.Description>
        Your account has been suspended due to a violation of our terms of
        service.
      </Alert.Description>
    </Alert>
  ),
};

export const Warning: Story = {
  // TODO(a11y): as cores da variante warning não atingem contraste 4.5:1 —
  // corrigir tokens no componente/tema.
  parameters: { a11y: { test: 'todo' } },
  args: { variant: 'warning' },
  render: args => (
    <Alert {...args}>
      <Icon name="TriangleWarning" />
      <Alert.Title>Subscription expiring</Alert.Title>
      <Alert.Description>
        Your subscription will expire in 3 days. Update your payment method to
        avoid interruption.
      </Alert.Description>
    </Alert>
  ),
};

export const Info: Story = {
  // TODO(a11y): as cores da variante info não atingem contraste 4.5:1 —
  // corrigir tokens no componente/tema.
  parameters: { a11y: { test: 'todo' } },
  args: { variant: 'info' },
  render: args => (
    <Alert {...args}>
      <Icon name="CircleInfo" />
      <Alert.Title>New feature available</Alert.Title>
      <Alert.Description>
        We have released dark mode support. Go to settings to enable it.
      </Alert.Description>
    </Alert>
  ),
};

export const Success: Story = {
  // TODO(a11y): as cores da variante success não atingem contraste 4.5:1 —
  // corrigir tokens no componente/tema.
  parameters: { a11y: { test: 'todo' } },
  args: { variant: 'success' },
  render: args => (
    <Alert {...args}>
      <Icon name="CircleCheck" />
      <Alert.Title>Operation completed</Alert.Title>
      <Alert.Description>
        Your changes have been saved successfully.
      </Alert.Description>
    </Alert>
  ),
};

export const TitleOnly: Story = {
  // TODO(a11y): as cores da variante info não atingem contraste 4.5:1 —
  // corrigir tokens no componente/tema.
  parameters: { a11y: { test: 'todo' } },
  args: { variant: 'info' },
  render: args => (
    <Alert {...args}>
      <Icon name="CircleCheck" />
      <Alert.Title>Update completed successfully.</Alert.Title>
    </Alert>
  ),
};

export const DescriptionOnly: Story = {
  // TODO(a11y): as cores da variante destructive não atingem contraste
  // 4.5:1 — corrigir tokens no componente/tema.
  parameters: { a11y: { test: 'todo' } },
  args: { variant: 'destructive' },
  render: args => (
    <Alert {...args}>
      <Icon name="TriangleWarning" />
      <Alert.Description>
        Payment failed. Please try again or use a different card.
      </Alert.Description>
    </Alert>
  ),
};

export const WithoutIcon: Story = {
  render: args => (
    <Alert {...args}>
      <Alert.Title>Plain message</Alert.Title>
      <Alert.Description>
        This alert has no icon, just a title and description.
      </Alert.Description>
    </Alert>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { toast } from 'sonner';

import { ToastProvider } from './toast';
import { Button } from '@/components/ui/button';

const meta: Meta<typeof ToastProvider> = {
  title: 'UI/Toast',
  component: ToastProvider,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],
      description: 'Canto da tela onde os toasts são exibidos.',
      table: {
        category: 'Aparência',
        defaultValue: { summary: "'bottom-right'" },
      },
    },
    richColors: {
      control: 'boolean',
      description:
        'Colore os toasts de sucesso/erro/aviso/info como os Alerts. Passe `false` para toasts neutros no estilo card.',
      table: { category: 'Aparência', defaultValue: { summary: 'true' } },
    },
    theme: {
      control: 'select',
      options: ['light', 'dark', 'system'],
      description:
        "Tema dos toasts. Também aceita um id de tema do app ('cream', 'onix', …).",
      table: { category: 'Aparência', defaultValue: { summary: "'system'" } },
    },
    invert: {
      control: 'boolean',
      description: 'Inverte as cores dos toasts em relação ao tema atual.',
      table: { category: 'Aparência', defaultValue: { summary: 'false' } },
    },
    closeButton: {
      control: 'boolean',
      description: 'Exibe um botão de fechar em cada toast.',
      table: { category: 'Comportamento', defaultValue: { summary: 'false' } },
    },
    expand: {
      control: 'boolean',
      description:
        'Mantém os toasts sempre expandidos em vez de empilhados uns sobre os outros.',
      table: { category: 'Comportamento', defaultValue: { summary: 'false' } },
    },
    duration: {
      control: 'number',
      description: 'Tempo (ms) que cada toast permanece visível.',
      table: { category: 'Comportamento', defaultValue: { summary: '4000' } },
    },
    visibleToasts: {
      control: 'number',
      description: 'Quantidade máxima de toasts visíveis ao mesmo tempo.',
      table: { category: 'Comportamento', defaultValue: { summary: '3' } },
    },
    gap: {
      control: 'number',
      description: 'Espaço (px) entre os toasts quando expandidos.',
      table: { category: 'Aparência', defaultValue: { summary: '14' } },
    },
    offset: {
      control: false,
      description:
        'Distância dos toasts em relação às bordas da viewport (número, string ou objeto por lado).',
      table: { category: 'Aparência' },
    },
    toastOptions: {
      control: false,
      description:
        'Opções padrão aplicadas a todos os toasts (classes, duração, estilos, etc.).',
      table: { category: 'Comportamento' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao container dos toasts.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    position: 'bottom-center',
    richColors: true,
    closeButton: false,
    expand: false,
    invert: false,
    duration: 4000,
    visibleToasts: 3,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: args => (
    <div className="flex min-h-96 items-center justify-center">
      <ToastProvider {...args} />
      <Button onClick={() => toast('Event has been created')}>
        Show Toast
      </Button>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Show Toast' }));

    // O sonner renderiza os toasts em um portal fora do canvas da story.
    const body = within(document.body);
    await waitFor(() =>
      expect(body.getByText('Event has been created')).toBeVisible(),
    );
  },
};

export const Types: Story = {
  // TODO(a11y): o Button variant="destructive" tem contraste insuficiente
  // (tokens de cor do componente Button/tema, não desta story).
  parameters: { a11y: { test: 'todo' } },
  render: args => (
    <div className="flex min-h-96 items-center justify-center">
      <ToastProvider {...args} />
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => toast.success('Changes saved successfully')}>
          Success
        </Button>
        <Button
          variant="destructive"
          onClick={() => toast.error('Failed to save changes')}
        >
          Error
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast.info('New update available')}
        >
          Info
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.warning('Your session will expire soon')}
        >
          Warning
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
              loading: 'Uploading file...',
              success: 'File uploaded',
              error: 'Upload failed',
            })
          }
        >
          Promise
        </Button>
      </div>
    </div>
  ),
};

export const WithDescription: Story = {
  // TODO(a11y): o Button variant="destructive" tem contraste insuficiente
  // (tokens de cor do componente Button/tema, não desta story).
  parameters: { a11y: { test: 'todo' } },
  render: args => (
    <div className="flex min-h-96 items-center justify-center">
      <ToastProvider {...args} />
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() =>
            toast.success('Changes saved', {
              description: 'Your profile has been updated successfully.',
            })
          }
        >
          Success
        </Button>
        <Button
          variant="destructive"
          onClick={() =>
            toast.error('Upload failed', {
              description: 'The file is too large. Maximum size is 5MB.',
            })
          }
        >
          Error
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.info('New feature', {
              description: 'You can now export reports in PDF format.',
            })
          }
        >
          Info
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.warning('Storage almost full', {
              description:
                'You have used 92% of your storage. Upgrade to continue.',
            })
          }
        >
          Warning
        </Button>
      </div>
    </div>
  ),
};

export const Positions: Story = {
  render: () => (
    <div className="flex min-h-96 items-center justify-center">
      <ToastProvider richColors position="bottom-center" />
      <div className="flex flex-wrap gap-2">
        {(
          [
            'top-left',
            'top-center',
            'top-right',
            'bottom-left',
            'bottom-center',
            'bottom-right',
          ] as const
        ).map(pos => (
          <Button
            key={pos}
            variant="outline"
            onClick={() => toast(`Position: ${pos}`, { position: pos })}
          >
            {pos}
          </Button>
        ))}
      </div>
    </div>
  ),
};

export const RichContent: Story = {
  render: args => (
    <div className="flex min-h-96 items-center justify-center">
      <ToastProvider {...args} />
      <Button
        onClick={() =>
          toast('Friend request', {
            description: 'Jane Cooper wants to add you as a friend.',
            action: {
              label: 'Accept',
              onClick: () => toast.success('Friend request accepted'),
            },
            cancel: {
              label: 'Decline',
              onClick: () => toast('Friend request declined'),
            },
          })
        }
      >
        Rich Toast
      </Button>
    </div>
  ),
};

export const LoadingState: Story = {
  // TODO(a11y): o Button variant="primary" tem contraste insuficiente
  // (tokens de cor do componente Button/tema, não desta story).
  parameters: { a11y: { test: 'todo' } },
  render: args => (
    <div className="flex min-h-96 items-center justify-center">
      <ToastProvider {...args} />
      <Button
        variant="primary"
        onClick={() =>
          toast.promise(
            new Promise<string>(resolve =>
              setTimeout(() => resolve('Payment completed'), 1500),
            ),
            {
              loading: 'Processing payment...',
              success: data => data,
              error: 'Payment failed',
            },
          )
        }
      >
        Simulate Payment
      </Button>
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { ANNOUNCEMENT_TYPES, AnnouncementBanner } from './announcement-banner';

const meta: Meta<typeof AnnouncementBanner> = {
  title: 'Layouts/AnnouncementBanner',
  component: AnnouncementBanner,
  parameters: {
    layout: 'fullscreen',
    docs: {
      // O banner usa position: fixed — um iframe por story dá a cada preview
      // um viewport próprio em vez de todos os banners empilharem no topo da
      // página de docs.
      story: { inline: false, height: '120px' },
      description: {
        component:
          'Banner fixo no topo da página para avisos do produto. Define a variável global `--announcement-height` (usada pelo `AppShell` para deslocar header e sidebars) e aplica marquee automático quando a mensagem não cabe na largura disponível.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: 'Mensagem do banner. Vazia, o banner não é renderizado.',
      table: { category: 'Conteúdo' },
    },
    typeLabel: {
      control: 'text',
      description:
        'Rótulo do chip exibido antes da mensagem no desktop. Por padrão usa o próprio `type` — passe um rótulo traduzido se necessário.',
      table: { category: 'Conteúdo' },
    },
    type: {
      control: 'select',
      options: Object.values(ANNOUNCEMENT_TYPES),
      description:
        'Tipo semântico; controla o par de cores. Valores desconhecidos caem em `NEW`.',
      table: {
        category: 'Aparência',
        type: { summary: 'AnnouncementType' },
        defaultValue: { summary: "'NEW'" },
      },
    },
    dismissible: {
      control: 'boolean',
      description: 'Mostra o botão de fechar o banner.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: 'true' },
      },
    },
    onDismiss: {
      control: false,
      description: 'Callback disparado quando o usuário fecha o banner.',
      table: { category: 'Estado' },
    },
    dismissAriaLabel: {
      control: 'text',
      description:
        'Nome acessível (`aria-label`) do botão de fechar, que exibe apenas um ícone.',
      table: {
        category: 'Acessibilidade',
        defaultValue: { summary: "'Dismiss announcement'" },
      },
    },
    closeButtonId: {
      control: 'text',
      description:
        '`id` opcional aplicado ao botão de fechar (ex.: um id de analytics).',
      table: { category: 'Comportamento' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao container do banner.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    message: 'A brand new analytics dashboard is now available.',
    type: 'NEW',
    typeLabel: 'New',
    dismissible: true,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvas, userEvent }) => {
    const message = canvas.getByText(
      'A brand new analytics dashboard is now available.',
    );

    // O banner entra animando a opacidade — espera a entrada terminar.
    await waitFor(() => expect(message).toBeVisible());

    await userEvent.click(
      canvas.getByRole('button', { name: 'Dismiss announcement' }),
    );

    await waitFor(() => expect(message).not.toBeInTheDocument());
  },
};

/** Tipos de erro (`ERROR`/`CRITICAL`) usam o par de cores destrutivo. */
export const Critical: Story = {
  args: {
    type: 'CRITICAL',
    typeLabel: 'Critical',
    message:
      'Your subscription is inactive. Update your billing information to keep using the product.',
  },
};

/** Aviso de manutenção com o par de cores de warning. */
export const Maintenance: Story = {
  args: {
    type: 'MAINTENANCE',
    typeLabel: 'Maintenance',
    message: 'Scheduled maintenance this Saturday from 02:00 to 04:00 UTC.',
  },
};

/** `dismissible={false}` remove o botão de fechar. */
export const NotDismissible: Story = {
  args: {
    type: 'WARNING',
    typeLabel: 'Warning',
    message: 'This banner cannot be dismissed.',
    dismissible: false,
  },
};

/**
 * Mensagens maiores que a largura disponível entram em marquee automático,
 * indo e voltando para continuarem legíveis.
 */
export const OverflowingMessage: Story = {
  render: args => (
    <div className="mx-auto max-w-md">
      <AnnouncementBanner {...args} className="max-w-md mx-auto" />
    </div>
  ),
  args: {
    type: 'INFO',
    typeLabel: 'Info',
    message:
      'This is a very long announcement message that will not fit in the available space, so it automatically scrolls back and forth like a marquee to stay readable.',
  },
};

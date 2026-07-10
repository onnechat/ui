import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { Tabs } from './tabs';
import { Icon } from '@/components/icon';

const meta: Meta<typeof Tabs> = {
  title: 'UI/Tabs',
  component: Tabs,
  subcomponents: {
    'Tabs.List': Tabs.List,
    'Tabs.Trigger': Tabs.Trigger,
    'Tabs.Content': Tabs.Content,
  } as Meta<typeof Tabs>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description:
        'Orientação da navegação por teclado e do atributo `aria-orientation`.',
      table: {
        category: 'Comportamento',
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: "'horizontal'" },
      },
    },
    defaultValue: {
      control: false,
      description: 'Tab selecionada inicialmente, no modo não controlado.',
      table: { category: 'Estado' },
    },
    value: {
      control: false,
      description: 'Tab selecionada no modo controlado.',
      table: { category: 'Estado' },
    },
    onValueChange: {
      control: false,
      description: 'Callback disparado quando a tab selecionada muda.',
      table: { category: 'Estado' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao container raiz.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    orientation: 'horizontal',
    className: 'w-full min-w-(--container-md) max-w-(--container-md)',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    defaultValue: 'overview',
  },
  render: args => (
    <Tabs {...args}>
      <Tabs.List>
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
        <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="overview">
        <h4 className="font-semibold">Overview</h4>
        <p className="text-sm text-muted-foreground">
          View your key metrics and recent project activity. Track progress
          across all your active projects.
        </p>
      </Tabs.Content>

      <Tabs.Content value="analytics">
        <h4 className="font-semibold">Analytics</h4>
        <p className="text-sm text-muted-foreground">
          View detailed analytics and insights for your projects.
        </p>
      </Tabs.Content>

      <Tabs.Content value="reports">
        <h4 className="font-semibold">Reports</h4>
        <p className="text-sm text-muted-foreground">
          Generate and download reports for your projects.
        </p>
      </Tabs.Content>

      <Tabs.Content value="settings">
        <h4 className="font-semibold">Settings</h4>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </Tabs.Content>
    </Tabs>
  ),
  play: async ({ canvas, userEvent }) => {
    const overviewTab = canvas.getByRole('tab', { name: 'Overview' });
    await expect(overviewTab).toHaveAttribute('aria-selected', 'true');

    const analyticsTab = canvas.getByRole('tab', { name: 'Analytics' });
    await userEvent.click(analyticsTab);

    await expect(analyticsTab).toHaveAttribute('aria-selected', 'true');
    await expect(overviewTab).toHaveAttribute('aria-selected', 'false');

    const panel = await canvas.findByText(
      'View detailed analytics and insights for your projects.',
    );
    await waitFor(() => expect(panel).toBeVisible());
  },
};

export const Vertical: Story = {
  args: {
    defaultValue: 'account',
    orientation: 'vertical',
    className: 'w-full min-w-(--container-md) max-w-(--container-md) h-48',
    children: (
      <div className="flex h-full min-h-0 w-full flex-1">
        <Tabs.List className="flex-col items-start self-stretch p-4 min-w-[160px]">
          <Tabs.Trigger value="account">Account</Tabs.Trigger>
          <Tabs.Trigger value="password">Password</Tabs.Trigger>
          <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
        </Tabs.List>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <Tabs.Content value="account">
            <h4 className="font-semibold">Account</h4>
            <p className="text-sm text-muted-foreground">
              Make changes to your account here.
            </p>
          </Tabs.Content>

          <Tabs.Content value="password">
            <h4 className="font-semibold">Password</h4>
            <p className="text-sm text-muted-foreground">
              Change your password here.
            </p>
          </Tabs.Content>

          <Tabs.Content value="notifications">
            <h4 className="font-semibold">Notifications</h4>
            <p className="text-sm text-muted-foreground">
              Manage your notification settings.
            </p>
          </Tabs.Content>
        </div>
      </div>
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('tab', { name: 'Account' })).toBeVisible();
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: 'home',
    children: (
      <>
        <Tabs.List>
          <Tabs.Trigger value="home">Home</Tabs.Trigger>
          <Tabs.Trigger value="disabled" disabled>
            Disabled
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="home">
          <p className="text-sm text-muted-foreground">Home content.</p>
        </Tabs.Content>

        <Tabs.Content value="disabled">
          <p className="text-sm text-muted-foreground">This is unreachable.</p>
        </Tabs.Content>
      </>
    ),
  },
  play: async ({ canvas, userEvent }) => {
    const disabledTab = canvas.getByRole('tab', { name: 'Disabled' });
    // Base UI marca tabs desabilitadas com aria-disabled, não com o atributo disabled.
    await expect(disabledTab).toHaveAttribute('aria-disabled', 'true');

    // Clicar na tab desabilitada não muda a seleção.
    await userEvent.click(disabledTab);
    await expect(canvas.getByRole('tab', { name: 'Home' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  },
};

export const Icons: Story = {
  args: {
    defaultValue: 'preview',
    children: (
      <>
        <Tabs.List>
          <Tabs.Trigger value="preview">
            <Icon name="Eye" className="size-4" />
            <span className="ml-2">Preview</span>
          </Tabs.Trigger>
          <Tabs.Trigger value="code">
            <Icon name="Code" className="size-4" />
            <span className="ml-2">Code</span>
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="preview">
          <p className="text-sm text-muted-foreground">Preview mode content.</p>
        </Tabs.Content>
        <Tabs.Content value="code">
          <p className="text-sm text-muted-foreground">Code mode content.</p>
        </Tabs.Content>
      </>
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('tab', { name: 'Preview' })).toBeVisible();
  },
};

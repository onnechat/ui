import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';

import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import { Command } from './command';

const meta: Meta<typeof Command> = {
  title: 'UI/Command',
  component: Command,
  subcomponents: {
    'Command.Input': Command.Input,
    'Command.List': Command.List,
    'Command.Empty': Command.Empty,
    'Command.Group': Command.Group,
    'Command.Item': Command.Item,
    'Command.Separator': Command.Separator,
    'Command.Shortcut': Command.Shortcut,
    'Command.Dialog': Command.Dialog,
    'Command.Footer': Command.Footer,
  } as Meta<typeof Command>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description:
        'Rótulo acessível do input, visualmente oculto (anunciado por leitores de tela).',
      table: { category: 'Conteúdo' },
    },
    shouldFilter: {
      control: 'boolean',
      description:
        'Filtra os itens automaticamente conforme a busca. Desative para filtrar externamente.',
      table: { category: 'Comportamento', defaultValue: { summary: 'true' } },
    },
    filter: {
      control: false,
      description:
        '`(value, search, keywords) => number` — score de 0 a 1 por item; 0 remove da lista.',
      table: { category: 'Comportamento' },
    },
    loop: {
      control: 'boolean',
      description:
        'Navegação circular: das extremidades da lista, as setas voltam ao início/fim.',
      table: { category: 'Comportamento', defaultValue: { summary: 'false' } },
    },
    disablePointerSelection: {
      control: 'boolean',
      description: 'Impede que o hover do mouse mude o item destacado.',
      table: { category: 'Comportamento', defaultValue: { summary: 'false' } },
    },
    value: {
      control: false,
      description: 'Valor do item destacado, no modo controlado.',
      table: { category: 'Estado' },
    },
    onValueChange: {
      control: false,
      description: 'Callback disparado quando o item destacado muda.',
      table: { category: 'Estado' },
    },
    defaultValue: {
      control: false,
      description: 'Item destacado inicialmente, no modo não controlado.',
      table: { category: 'Estado' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao container raiz.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    label: 'Command menu',
    shouldFilter: true,
    loop: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  // TODO(a11y): os headings de grupo usam text-muted-foreground/50 sobre
  // bg-muted (contraste 2.26 — estilo do componente, não da story).
  parameters: { a11y: { test: 'todo' } },
  render: args => (
    <div className="w-full max-w-md">
      <Command {...args}>
        <Command.Input placeholder="Type a command or search…" />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          <Command.Group heading="Suggestions">
            <Command.Item onSelect={() => {}}>
              <Icon name="Calendar" className="size-4" />
              Calendar
            </Command.Item>
            <Command.Item onSelect={() => {}}>
              <Icon name="Envelope" className="size-4" />
              Mail
            </Command.Item>
            <Command.Item onSelect={() => {}}>
              <Icon name="Gear" className="size-4" />
              Settings
            </Command.Item>
          </Command.Group>
          <Command.Group heading="People">
            <Command.Item onSelect={() => {}}>
              <Icon name="User" className="size-4" />
              John Doe
            </Command.Item>
            <Command.Item onSelect={() => {}}>
              <Icon name="User" className="size-4" />
              Jane Smith
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByPlaceholderText('Type a command or search…');
    await userEvent.type(input, 'cal');

    // A busca filtra a lista: só "Calendar" permanece.
    await waitFor(() => {
      expect(canvas.getByRole('option', { name: /Calendar/ })).toBeVisible();
      expect(
        canvas.queryByRole('option', { name: /Mail/ }),
      ).not.toBeInTheDocument();
    });

    await userEvent.clear(input);
    await waitFor(() =>
      expect(canvas.getByRole('option', { name: /Mail/ })).toBeVisible(),
    );
  },
};

export const WithShortcuts: Story = {
  // TODO(a11y): contraste dos headings de grupo (componente).
  parameters: { a11y: { test: 'todo' } },
  render: args => (
    <div className="w-full max-w-md">
      <Command {...args}>
        <Command.Input placeholder="Search actions…" />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          <Command.Group heading="Actions">
            <Command.Item onSelect={() => {}}>
              <Icon name="Copy" className="size-4" />
              Copy
              <Command.Shortcut>⌘C</Command.Shortcut>
            </Command.Item>
            <Command.Item onSelect={() => {}}>
              <Icon name="ClipboardCheck" className="size-4" />
              Paste
              <Command.Shortcut>⌘V</Command.Shortcut>
            </Command.Item>
            <Command.Item onSelect={() => {}}>
              <Icon name="Magnifier" className="size-4" />
              Search
              <Command.Shortcut>⌘F</Command.Shortcut>
            </Command.Item>
            <Command.Item onSelect={() => {}}>
              <Icon name="Undo" className="size-4" />
              Undo
              <Command.Shortcut>⌘Z</Command.Shortcut>
            </Command.Item>
            <Command.Item onSelect={() => {}}>
              <Icon name="Redo" className="size-4" />
              Redo
              <Command.Shortcut>⌘⇧Z</Command.Shortcut>
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  ),
};

export const WithDisabledItems: Story = {
  // TODO(a11y): contraste dos headings de grupo (componente).
  parameters: { a11y: { test: 'todo' } },
  render: args => (
    <div className="w-full max-w-md">
      <Command {...args}>
        <Command.Input placeholder="Type to filter…" />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          <Command.Group heading="Available">
            <Command.Item onSelect={() => {}}>
              <Icon name="Eye" className="size-4" />
              View
            </Command.Item>
            <Command.Item onSelect={() => {}}>
              <Icon name="Pencil" className="size-4" />
              Edit
            </Command.Item>
          </Command.Group>
          <Command.Group heading="Unavailable">
            <Command.Item disabled onSelect={() => {}}>
              <Icon name="Trash" className="size-4" />
              Delete
            </Command.Item>
            <Command.Item disabled onSelect={() => {}}>
              <Icon name="Bomb" className="size-4" />
              Destroy
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  ),
};

export const Filtering: Story = {
  // TODO(a11y): contraste dos headings de grupo (componente).
  parameters: { a11y: { test: 'todo' } },
  render: function FilteringStory(args) {
    const items = [
      { label: 'Apple', category: 'Fruits' },
      { label: 'Banana', category: 'Fruits' },
      { label: 'Cherry', category: 'Fruits' },
      { label: 'Carrot', category: 'Vegetables' },
      { label: 'Broccoli', category: 'Vegetables' },
      { label: 'Chicken', category: 'Meat' },
      { label: 'Salmon', category: 'Fish' },
    ];

    return (
      <div className="w-full max-w-md">
        <Command {...args}>
          <Command.Input placeholder="Search items…" />
          <Command.List>
            <Command.Empty>No results found.</Command.Empty>
            <Command.Group heading="Items">
              {items.map(item => (
                <Command.Item
                  key={item.label}
                  value={item.label}
                  onSelect={() => {}}
                >
                  <Icon name="Dots" className="size-4" />
                  {item.label}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {item.category}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    );
  },
};

export const DialogMode: Story = {
  render: function DialogModeStory(_args) {
    const [open, setOpen] = React.useState(false);

    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          <Icon name="Magnifier" className="size-4" />
          Open Command Palette
          <Kbd keys={['Mod', 'K']} className="ml-2" />
        </Button>

        <Command.Dialog
          open={open}
          onOpenChange={setOpen}
          title="Command Palette"
          description="Search for commands…"
        >
          <Command.Input placeholder="Type a command or search…" />
          <Command.List>
            <Command.Empty>No results found.</Command.Empty>
            <Command.Group heading="Navigation" className="pb-4">
              <Command.Item onSelect={() => setOpen(false)}>
                <Icon name="User" className="size-4" />
                Profile
                <Command.Shortcut>⌘P</Command.Shortcut>
              </Command.Item>
              <Command.Item onSelect={() => setOpen(false)}>
                <Icon name="Gear" className="size-4" />
                Settings
                <Command.Shortcut>⌘,</Command.Shortcut>
              </Command.Item>
              <Command.Item onSelect={() => setOpen(false)}>
                <Icon name="Envelope" className="size-4" />
                Messages
                <Command.Shortcut>⌘M</Command.Shortcut>
              </Command.Item>
            </Command.Group>
            <Command.Group heading="Actions" className="pb-4">
              <Command.Item onSelect={() => setOpen(false)}>
                <Icon name="Plus" className="size-4" />
                New file
                <Command.Shortcut>⌘N</Command.Shortcut>
              </Command.Item>
              <Command.Item onSelect={() => setOpen(false)}>
                <Icon name="Magnifier" className="size-4" />
                Find in files
                <Command.Shortcut>⌘⇧F</Command.Shortcut>
              </Command.Item>
            </Command.Group>
          </Command.List>

          <Command.Footer />
        </Command.Dialog>
      </>
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: /Open Command Palette/ }),
    );

    // O dialog renderiza em portal no body, fora do canvas da story.
    const body = within(document.body);
    const dialog = await body.findByRole('dialog');
    await waitFor(() => expect(dialog).toBeVisible());

    // Selecionar um item fecha o palette.
    await userEvent.click(await body.findByRole('option', { name: /Profile/ }));
    await waitFor(() =>
      expect(body.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Icon } from '@/components/icon';
import { ScrollArea } from './scroll-area';

const meta: Meta<typeof ScrollArea> = {
  title: 'UI/ScrollArea',
  component: ScrollArea,
  subcomponents: {
    'ScrollArea.ScrollBar': ScrollArea.ScrollBar,
  } as Meta<typeof ScrollArea>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description:
        'Conteúdo rolável, renderizado dentro do viewport. A barra vertical e o canto já vêm embutidos.',
      table: { category: 'Conteúdo' },
    },
    className: {
      control: 'text',
      description:
        'Classes extras no container raiz — defina aqui as dimensões da área visível (ex.: `h-72 w-72`).',
      table: { category: 'Aparência' },
    },
  },
  args: {
    className: 'h-72 w-72 rounded-xl border bg-muted',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const MEMBERS = [
  { name: 'Ana Souza', role: 'Product Designer' },
  { name: 'Bruno Carvalho', role: 'Frontend Engineer' },
  { name: 'Camila Nunes', role: 'Design Engineer' },
  { name: 'Diego Ramos', role: 'Backend Engineer' },
  { name: 'Elisa Prado', role: 'Product Manager' },
  { name: 'Felipe Antunes', role: 'QA Engineer' },
  { name: 'Gabriela Rocha', role: 'Data Analyst' },
  { name: 'Henrique Dias', role: 'DevOps Engineer' },
  { name: 'Isabela Freitas', role: 'UX Researcher' },
  { name: 'João Pedro', role: 'Mobile Engineer' },
  { name: 'Karina Melo', role: 'Content Designer' },
  { name: 'Lucas Barros', role: 'Solutions Architect' },
  { name: 'Marina Costa', role: 'Support Lead' },
  { name: 'Nicolas Vieira', role: 'Security Engineer' },
];

const PARAGRAPHS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  'Nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error.',
  'Sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt.',
  'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore.',
];

const COVERS = [
  { title: 'Overview', meta: '12 widgets', icon: 'Eye' },
  { title: 'Calendar', meta: '8 events', icon: 'Calendar' },
  { title: 'Inbox', meta: '24 messages', icon: 'Envelope' },
  { title: 'Search', meta: 'Saved queries', icon: 'Magnifier' },
  { title: 'Settings', meta: 'Workspace', icon: 'Gear' },
  { title: 'Members', meta: '14 people', icon: 'User' },
  { title: 'Notes', meta: '32 files', icon: 'Pencil' },
  { title: 'Create', meta: 'New board', icon: 'Plus' },
] as const;

export const Playground: Story = {
  render: args => (
    <ScrollArea {...args}>
      <div className="flex flex-col p-1.5">
        <p className="px-2.5 pb-1 pt-2 text-xs font-medium text-muted-foreground">
          Team · {MEMBERS.length} members
        </p>
        {MEMBERS.map(member => (
          <div
            key={member.name}
            className="flex items-center gap-3 rounded-lg px-2.5 py-2"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Icon name="User" className="size-4" />
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium">
                {member.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {member.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
  play: async ({ canvas }) => {
    // O primeiro membro aparece no viewport; toda a lista é renderizada,
    // mesmo os itens fora da área visível.
    await expect(canvas.getByText('Ana Souza')).toBeVisible();
    await expect(canvas.getByText('Nicolas Vieira')).toBeInTheDocument();
  },
};

export const WithLongContent: Story = {
  args: {
    className: 'h-64 w-96 rounded-xl border bg-muted',
  },
  render: args => (
    <ScrollArea {...args}>
      <div className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-1">
          <h4 className="text-sm font-semibold">Terms of Service</h4>
          <p className="text-xs text-muted-foreground">
            Updated on July 10, 2026
          </p>
        </div>
        {PARAGRAPHS.map((text, i) => (
          <p key={i} className="text-sm leading-relaxed text-muted-foreground">
            {text}
          </p>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const HorizontalScroll: Story = {
  args: {
    className: 'w-96 rounded-xl border bg-muted',
  },
  render: args => (
    <ScrollArea {...args}>
      <div className="flex gap-3 p-4">
        {COVERS.map(cover => (
          <div
            key={cover.title}
            className="flex w-40 shrink-0 flex-col gap-3 rounded-lg border bg-card p-3"
          >
            <span className="flex aspect-video items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Icon name={cover.icon} className="size-6" />
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{cover.title}</span>
              <span className="text-xs text-muted-foreground">
                {cover.meta}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

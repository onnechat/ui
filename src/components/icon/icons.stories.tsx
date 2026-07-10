import { useMemo, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Icon } from '@/components/icon';
import { Input } from '@/components/ui/input';

import { fillIcons } from './variants';
import type { FillIconName } from './variants';

const iconNames = Object.keys(fillIcons).sort();

// As props do Icon são uma união discriminada por `variant` (cada variante
// aceita um conjunto próprio de nomes), o que colapsa a inferência de args do
// Storybook para `never`. Tipo plano para os controls.
type IconStoryArgs = {
  name: string;
  variant?: 'fill' | 'duo' | 'brand' | 'social' | 'custom';
  className?: string;
};

const meta: Meta<IconStoryArgs> = {
  title: 'UI/Icons',
  component: Icon as Meta<IconStoryArgs>['component'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    name: {
      control: 'text',
      description: `Nome do ícone (${iconNames.length} disponíveis na variante fill). Use a story Gallery para pesquisar todos os nomes.`,
      table: { category: 'Conteúdo' },
    },
    variant: {
      control: 'select',
      options: ['fill', 'duo', 'brand', 'social', 'custom'],
      description:
        'Conjunto de ícones usado. Nem todo nome existe em todas as variantes.',
      table: {
        category: 'Aparência',
        type: { summary: "'fill' | 'duo' | 'brand' | 'social' | 'custom'" },
        defaultValue: { summary: "'fill'" },
      },
    },
    className: {
      control: 'text',
      description: 'Classes extras (tamanho, cor, etc.).',
      table: { category: 'Aparência' },
    },
  },
  args: {
    name: 'House',
    className: 'size-8',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

function IconGallery() {
  const [search, setSearch] = useState('');

  const filteredIcons = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return iconNames;
    return iconNames.filter(name => name.toLowerCase().includes(query));
  }, [search]);

  return (
    <div className="flex h-[70vh] w-[42rem] max-w-full flex-col gap-4 p-4">
      <Input
        type="search"
        placeholder={`Search ${iconNames.length} icons…`}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {filteredIcons.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          No icons found for “{search}”
        </div>
      ) : (
        <div
          role="region"
          aria-label="Icons"
          tabIndex={0}
          className="grid flex-1 auto-rows-min grid-cols-3 gap-2 overflow-y-auto pr-1"
        >
          {filteredIcons.map(name => (
            <div
              key={name}
              className="flex flex-col items-center justify-center gap-4 rounded-xl bg-card p-4"
            >
              <Icon
                name={name as FillIconName}
                className="size-6 text-muted-foreground"
              />

              <span className="text-sm text-muted-foreground text-center leading-tight break-all">
                {name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const Gallery: Story = {
  render: () => <IconGallery />,
};

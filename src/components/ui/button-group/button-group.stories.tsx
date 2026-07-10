import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from './button-group';
import { Icon, type IconType } from '@/components/icon';
import { ActionGroup } from '@/components/ui/action-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { InputGroup } from '@/components/ui/input-group';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/cn';

const meta: Meta<typeof ButtonGroup> = {
  title: 'UI/ButtonGroup',
  component: ButtonGroup,
  subcomponents: {
    ButtonGroupSeparator,
    ButtonGroupText,
  } as Meta<typeof ButtonGroup>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Direção em que os itens do grupo são empilhados.',
      table: {
        category: 'Aparência',
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: "'horizontal'" },
      },
    },
    children: {
      control: false,
      description:
        'Itens do grupo: botões, inputs, selects e afins. As bordas internas são coladas e o arredondamento é mantido apenas nas extremidades.',
      table: { category: 'Conteúdo' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao container do grupo.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    orientation: 'horizontal',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: args => (
    <ButtonGroup {...args}>
      <Button>Button 1</Button>
      <Button>Button 2</Button>
    </ButtonGroup>
  ),
};

export const Orientation: Story = {
  render: () => (
    <div className="flex gap-8">
      <ButtonGroup orientation="horizontal">
        <Button>Horizontal</Button>
        <Button>Group</Button>
      </ButtonGroup>
      <ButtonGroup orientation="vertical">
        <Button>Vertical</Button>
        <Button>Group</Button>
      </ButtonGroup>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ButtonGroup>
        <Button size="sm">Small</Button>
        <Button size="sm">Group</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button size="default">Default</Button>
        <Button size="default">Group</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button size="lg">Large</Button>
        <Button size="lg">Group</Button>
      </ButtonGroup>
    </div>
  ),
};

export const Nested: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroup>
        <Button>Group 1</Button>
        <Button>Group 1</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button>Group 2</Button>
        <Button>Group 2</Button>
      </ButtonGroup>
    </ButtonGroup>
  ),
};

export const Separator: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ButtonGroup>
        <Button>Copy</Button>
        <ButtonGroupSeparator />
        <Button>Paste</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Copy</Button>
        <ButtonGroupSeparator />
        <Button variant="outline">Paste</Button>
      </ButtonGroup>
    </div>
  ),
};

export const Split: Story = {
  render: () => (
    <ButtonGroup>
      <Button>Button</Button>
      <ButtonGroupSeparator />
      <ActionGroup
        items={[
          [
            { label: 'Edit', icon: 'Pen3' as IconType, onClick: fn() },
            { label: 'Duplicate', icon: 'Copy' as IconType, onClick: fn() },
          ],
          [
            {
              label: 'Delete',
              icon: 'Trash' as IconType,
              onClick: fn(),
              variant: 'destructive',
            },
          ],
        ]}
      >
        <Button size="icon" aria-label="More actions">
          <Icon name="ChevronDown" />
        </Button>
      </ActionGroup>
    </ButtonGroup>
  ),
};

type MenuEdgeProps = {
  'data-menu-edge-first'?: boolean;
  'data-menu-edge-last'?: boolean;
};

function menuEdgeRounding({
  'data-menu-edge-first': edgeFirst,
  'data-menu-edge-last': edgeLast,
}: MenuEdgeProps) {
  return cn(edgeFirst && 'rounded-t-xl', edgeLast && 'rounded-b-xl');
}

const VoicePanelRow = DropdownMenu.markRoundable(function VoicePanelRow({
  label,
  value,
  icon = 'ChevronRight',
  onClick,
  ...edgeProps
}: {
  label: string;
  value?: string;
  icon?: IconType;
  onClick?: () => void;
} & MenuEdgeProps) {
  return (
    <DropdownMenu.Item
      resetClassName
      onClick={onClick}
      className={cn(
        'flex items-center justify-between gap-3 px-2 py-2 cursor-pointer transition-colors hover:bg-accent',
        menuEdgeRounding(edgeProps),
      )}
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {value && (
          <span className="truncate text-xs text-muted-foreground">
            {value}
          </span>
        )}
      </div>
      <Icon name={icon} className="size-4 shrink-0 text-muted-foreground" />
    </DropdownMenu.Item>
  );
});

const VoicePanelSlider = DropdownMenu.markRoundable(function VoicePanelSlider({
  label,
  defaultValue,
  ...edgeProps
}: {
  label: string;
  defaultValue: number;
} & MenuEdgeProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 px-2 py-2',
        menuEdgeRounding(edgeProps),
      )}
    >
      <span className="text-sm font-medium text-foreground">{label}</span>
      <Slider defaultValue={defaultValue} />
    </div>
  );
});

const VoicePanelLevelMeter = DropdownMenu.markRoundable(
  function VoicePanelLevelMeter({
    level = 6,
    ...edgeProps
  }: { level?: number } & MenuEdgeProps) {
    return (
      <div
        className={cn(
          'flex flex-col gap-2 px-2 py-2',
          menuEdgeRounding(edgeProps),
        )}
      >
        <span className="text-sm font-medium text-foreground">Input Level</span>
        <div className="flex w-full items-center justify-between">
          {Array.from({ length: 32 }).map((_, index) => (
            <span
              key={index}
              className={cn(
                'h-3 w-1 shrink-0 rounded-full',
                index < level ? 'bg-primary' : 'bg-border',
              )}
            />
          ))}
        </div>
      </div>
    );
  },
);

const VoicePanelToggle = DropdownMenu.markRoundable(function VoicePanelToggle({
  label,
  checked,
  onCheckedChange,
  ...edgeProps
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
} & MenuEdgeProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center justify-between gap-3 px-2 py-2',
        menuEdgeRounding(edgeProps),
      )}
    >
      <span className="text-sm font-medium text-foreground">{label}</span>
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="border-border"
      />
    </label>
  );
});

export const SplitWithDropdownMenu: Story = {
  render: function SplitWithDropdownMenuStory() {
    const [deafened, setDeafened] = React.useState(false);

    return (
      <ButtonGroup>
        <Button aria-label="Toggle microphone">
          <Icon name="Microphone" className="size-4" />
        </Button>
        <ButtonGroupSeparator />
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <Button size="icon" aria-label="Voice settings">
              <Icon name="ChevronUp" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" className="w-64">
            <VoicePanelRow
              label="Input Device"
              value="System Default: HyperX SoloCast Analog Stereo"
            />
            <VoicePanelRow label="Input Profile" value="Custom" />
            <VoicePanelRow
              label="Output Device"
              value="System Default: Ryzen HD Audio Controller Analog Stereo"
            />
            <DropdownMenu.Separator />
            <VoicePanelSlider label="Input Volume" defaultValue={80} />
            <VoicePanelLevelMeter level={6} />
            <VoicePanelSlider label="Output Volume" defaultValue={65} />
            <DropdownMenu.Separator />
            <VoicePanelToggle
              label="Deafen"
              checked={deafened}
              onCheckedChange={setDeafened}
            />
            <VoicePanelRow label="Voice Settings" icon="Gear" />
          </DropdownMenu.Content>
        </DropdownMenu>
      </ButtonGroup>
    );
  },
};

export const WithInput: Story = {
  render: () => (
    <ButtonGroup>
      <Input placeholder="Search..." />
      <Button>Search</Button>
    </ButtonGroup>
  ),
};

export const WithInputGroup: Story = {
  render: () => (
    <ButtonGroup>
      <InputGroup>
        <InputGroup.Input placeholder="Username" />
        <InputGroup.Addon align="inline-start">
          <InputGroup.Text>@</InputGroup.Text>
        </InputGroup.Addon>
      </InputGroup>
      <Button>Submit</Button>
    </ButtonGroup>
  ),
};

export const WithInputGroupPrefix: Story = {
  render: () => (
    <ButtonGroup>
      <InputGroup>
        <InputGroup.Input placeholder="Username" />
        <InputGroup.Addon align="inline-start" variant="filled">
          <InputGroup.Text>@</InputGroup.Text>
        </InputGroup.Addon>
      </InputGroup>
      <Button>Submit</Button>
    </ButtonGroup>
  ),
};

export const WithText: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroupText>Filter by</ButtonGroupText>
      <Button variant="outline">All</Button>
      <Button variant="outline">Active</Button>
      <Button variant="outline">Inactive</Button>
    </ButtonGroup>
  ),
};

export const MixedVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ButtonGroup>
        <Button variant="default">Archive</Button>
        <ButtonGroupSeparator />
        <Button variant="default">Report</Button>
        <ButtonGroupSeparator />
        <Button variant="default">Delete</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Archive</Button>
        <ButtonGroupSeparator />
        <Button variant="outline">Report</Button>
        <ButtonGroupSeparator />
        <Button variant="outline">Delete</Button>
      </ButtonGroup>
    </div>
  ),
};

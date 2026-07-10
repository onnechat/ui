import { useCallback, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Card } from './card';
import { Button } from '@/components/ui/button';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  subcomponents: {
    'Card.Header': Card.Header,
    'Card.Content': Card.Content,
    'Card.Footer': Card.Footer,
    'Card.Slider': Card.Slider,
  } as Meta<typeof Card>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description:
        'Composição livre de `Card.Header`, `Card.Content`, `Card.Footer` e `Card.Slider`. O espaçamento entre seções se ajusta quando há `Card.Content`.',
      table: { category: 'Conteúdo' },
    },
    className: {
      control: 'text',
      description:
        'Classes extras aplicadas ao container raiz. Raio e padding internos são controlados pelas CSS vars `--card-radius` e `--card-padding`.',
      table: { category: 'Aparência' },
    },
  },
  args: {
    className: 'w-96',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: args => (
    <Card {...args}>
      <Card.Header>
        <h3 className="font-semibold text-lg">Card Title</h3>
      </Card.Header>

      <Card.Content>
        <p className="text-muted-foreground">Card content goes here.</p>
      </Card.Content>

      <Card.Footer>
        <p className="text-muted-foreground text-sm">Card footer</p>
      </Card.Footer>
    </Card>
  ),
};

export const OnlyHeader: Story = {
  render: args => (
    <Card {...args}>
      <Card.Header>
        <h3 className="font-semibold text-lg">Card Title</h3>
      </Card.Header>

      <Card.Content>
        <p className="text-muted-foreground">Card content goes here.</p>
      </Card.Content>
    </Card>
  ),
};

export const OnlyFooter: Story = {
  render: args => (
    <Card {...args}>
      <Card.Content>
        <p className="text-muted-foreground">Card content goes here.</p>
      </Card.Content>

      <Card.Footer>
        <p className="text-muted-foreground text-sm">Card footer</p>
      </Card.Footer>
    </Card>
  ),
};

export const OnlyContent: Story = {
  render: args => (
    <Card {...args}>
      <Card.Content>
        <p className="text-muted-foreground">Card content goes here.</p>
      </Card.Content>
    </Card>
  ),
};

export const WithSlider: Story = {
  render: function Render(args) {
    const [index, setIndex] = useState(0);
    const total = 3;

    const prev = useCallback(() => setIndex(i => Math.max(0, i - 1)), []);
    const next = useCallback(
      () => setIndex(i => Math.min(total - 1, i + 1)),
      [],
    );

    return (
      <Card {...args}>
        <Card.Content className="p-0">
          <Card.Slider index={index}>
            {Array.from({ length: total }).map((_, index) => (
              <div key={index} className="p-6">
                <h4 className="font-semibold">Step {index + 1}</h4>
                <p className="text-muted-foreground text-sm">Slide content</p>
              </div>
            ))}
          </Card.Slider>
        </Card.Content>

        <Card.Footer className="flex items-center justify-between w-full gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={prev}
            disabled={index === 0}
          >
            Prev
          </Button>

          <span className="text-xs text-muted-foreground tabular-nums">
            {index + 1} / {total}
          </span>

          <Button
            variant="secondary"
            size="sm"
            onClick={next}
            disabled={index === total - 1}
          >
            Next
          </Button>
        </Card.Footer>
      </Card>
    );
  },
};

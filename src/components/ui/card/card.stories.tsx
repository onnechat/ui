import { useCallback, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardContent, CardFooter, CardHeader, CardSlider } from './card';
import { Button } from '@/components/ui/button';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  subcomponents: { CardHeader, CardContent, CardFooter, CardSlider },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <h3 className="font-semibold text-lg">Card Title</h3>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground">Card content goes here.</p>
      </CardContent>

      <CardFooter>
        <p className="text-muted-foreground text-sm">Card footer</p>
      </CardFooter>
    </Card>
  ),
};

export const OnlyHeader: StoryObj<typeof meta> = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <h3 className="font-semibold text-lg">Card Title</h3>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground">Card content goes here.</p>
      </CardContent>
    </Card>
  ),
};

export const OnlyFooter: StoryObj<typeof meta> = {
  render: () => (
    <Card className="w-96">
      <CardContent>
        <p className="text-muted-foreground">Card content goes here.</p>
      </CardContent>

      <CardFooter>
        <p className="text-muted-foreground text-sm">Card footer</p>
      </CardFooter>
    </Card>
  ),
};

export const OnlyContent: StoryObj<typeof meta> = {
  render: () => (
    <Card className="w-96">
      <CardContent>
        <p className="text-muted-foreground">Card content goes here.</p>
      </CardContent>
    </Card>
  ),
};

export const WithSlider: StoryObj<typeof meta> = {
  render: function Render() {
    const [index, setIndex] = useState(0);
    const total = 3;

    const prev = useCallback(() => setIndex(i => Math.max(0, i - 1)), []);
    const next = useCallback(() => setIndex(i => Math.min(total - 1, i + 1)), []);

    return (
      <Card className="w-96">
        <CardContent className="p-0">
          <CardSlider index={index}>
            {Array.from({ length: total }).map((_, index) => (
              <div key={index} className="p-6">
                <h4 className="font-semibold">Step {index + 1}</h4>
                <p className="text-muted-foreground text-sm">Slide content</p>
              </div>
            ))}
          </CardSlider>
        </CardContent>

        <CardFooter className="flex items-center justify-between w-full gap-2">
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
        </CardFooter>
      </Card>
    );
  },
};

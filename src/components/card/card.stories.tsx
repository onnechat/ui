import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardContent, CardFooter, CardHeader, CardSlider } from './card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
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

export const WithSlider: StoryObj<typeof meta> = {
  render: () => (
    <Card className="w-96">
      <CardContent>
        <CardSlider index={0}>
          <div className="p-4">
            <h4 className="font-semibold">Step 1</h4>
            <p className="text-muted-foreground text-sm">First slide content</p>
          </div>
          <div className="p-4">
            <h4 className="font-semibold">Step 2</h4>
            <p className="text-muted-foreground text-sm">Second slide content</p>
          </div>
        </CardSlider>
      </CardContent>
    </Card>
  ),
};

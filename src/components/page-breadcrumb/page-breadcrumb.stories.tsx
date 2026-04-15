import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageBreadcrumb } from './page-breadcrumb';

const meta = {
  title: 'UI/PageBreadcrumb',
  component: typeof PageBreadcrumb !== 'undefined' ? PageBreadcrumb : undefined,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<any>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {},
};

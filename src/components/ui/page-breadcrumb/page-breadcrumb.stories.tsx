import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageBreadcrumb } from './page-breadcrumb';

const meta: Meta<typeof PageBreadcrumb> = {
  title: 'UI/PageBreadcrumb',
  component: PageBreadcrumb,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {},
};

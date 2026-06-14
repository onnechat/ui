import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarSeparator,
} from './sidebar';
import { FillIconName, Icon } from '@/components/icon';

const meta: Meta<typeof Sidebar> = {
  title: 'UI/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs', 'new'],
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Story />
      </SidebarProvider>
    ),
  ],
};

export default meta;

const NAV_ITEMS: { label: string; icon: FillIconName; active?: boolean }[] = [
  { label: 'Dashboard', icon: 'House' as const, active: true },
  { label: 'Analytics', icon: 'ChartColumn' as const },
  { label: 'Settings', icon: 'Gear' as const },
  { label: 'Users', icon: 'UserGroup' as const },
];

export const Default: StoryObj<typeof meta> = {
  render: () => (
    <div className="flex flex-1 min-h-screen">
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Icon name="House" className="size-4" />
            <span className="font-semibold">Onne</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_ITEMS.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton isActive={item.active}>
                      <Icon name={item.icon} className="size-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className="flex items-center gap-2 p-2 text-sm text-muted-foreground">
            <Icon name="User" className="size-4" />
            <span>admin@onne.com</span>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className='flex flex-1 w-full'>
        <header className="flex items-center gap-2 border-b p-4">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>
        <main className="p-6">
          <p className="text-muted-foreground">Page content goes here.</p>
        </main>
      </SidebarInset>
    </div>
  ),
  play: async ({ canvas }) => {
    const items = canvas.getAllByText('Dashboard');
    await expect(items.length).toBeGreaterThan(0);
  },
};

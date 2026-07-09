import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from './accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const meta: Meta<typeof Accordion> = {
  title: 'UI/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

const defaultCode = `<Accordion type="single" collapsible className="w-full min-w-(--container-md) max-w-(--container-md)">
  {Array.from({ length: 5 }, (_, i) => (
    <Accordion.Item key={i} value={\`item-\${i}\`}>
      <Accordion.Trigger>Item {i + 1}</Accordion.Trigger>
      <Accordion.Content>Content for item {i + 1}.</Accordion.Content>
    </Accordion.Item>
  ))}
</Accordion>`;

const multipleCode = `<Accordion
  type="multiple"
  defaultValue={['item-0']}
  className="w-full min-w-(--container-md) max-w-(--container-md)"
>
  {Array.from({ length: 5 }, (_, i) => (
    <Accordion.Item key={i} value={\`item-\${i}\`}>
      <Accordion.Trigger>Item {i + 1}</Accordion.Trigger>
      <Accordion.Content>Content for item {i + 1}.</Accordion.Content>
    </Accordion.Item>
  ))}
</Accordion>`;

const customTriggersCode = `<Accordion type="single" collapsible className="w-full min-w-(--container-md) max-w-(--container-md)">
  <Accordion.Item value="profile">
    <Accordion.Trigger>
      <span className="flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          A
        </span>
        Profile Settings
      </span>
    </Accordion.Trigger>
    <Accordion.Content>Manage your profile information, avatar, and display name.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="notifications">
    <Accordion.Trigger>
      <span className="flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-full bg-warning text-[10px] font-bold text-warning-foreground">
          B
        </span>
        Notifications
      </span>
    </Accordion.Trigger>
    <Accordion.Content>Configure email, push, and in-app notification preferences.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="billing">
    <Accordion.Trigger>
      <span className="flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-full bg-success text-[10px] font-bold text-success-foreground">
          C
        </span>
        Billing & Plans
      </span>
    </Accordion.Trigger>
    <Accordion.Content>View your current plan, payment methods, and billing history.</Accordion.Content>
  </Accordion.Item>
</Accordion>`;

const customContentCode = `<Accordion type="single" collapsible className="w-full min-w-(--container-md) max-w-(--container-md)">
  <Accordion.Item value="search">
    <Accordion.Trigger>Search</Accordion.Trigger>
    <Accordion.Content>
      <div className="flex flex-col gap-3">
        <Input placeholder="Search..." />
        <div className="flex gap-2">
          <Button size="sm" variant="primary">Search</Button>
          <Button size="sm" variant="outline">Clear</Button>
        </div>
      </div>
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="filters">
    <Accordion.Trigger>Filters</Accordion.Trigger>
    <Accordion.Content>
      <div className="flex flex-wrap gap-2">
        {['Active', 'Pending', 'Draft', 'Archived'].map((label) => (
          <Button key={label} size="sm" variant="secondary">{label}</Button>
        ))}
      </div>
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="actions">
    <Accordion.Trigger>Quick Actions</Accordion.Trigger>
    <Accordion.Content>
      <div className="flex flex-col gap-2">
        <Button variant="outline" className="justify-start">Export CSV</Button>
        <Button variant="outline" className="justify-start">Import Data</Button>
        <Button variant="destructive" className="justify-start">Delete All</Button>
      </div>
    </Accordion.Content>
  </Accordion.Item>
</Accordion>`;

export const Default: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: defaultCode,
      },
    },
  },
  render: () => (
    <Accordion
      type="single"
      collapsible
      className="w-full min-w-(--container-md) max-w-(--container-md)"
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Accordion.Item key={i} value={`item-${i}`}>
          <Accordion.Trigger>Item {i + 1}</Accordion.Trigger>
          <Accordion.Content>Content for item {i + 1}.</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion>
  ),
};

export const Multiple: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: multipleCode,
      },
    },
  },
  render: () => (
    <Accordion
      type="multiple"
      defaultValue={['item-0']}
      className="w-full min-w-(--container-md) max-w-(--container-md)"
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Accordion.Item key={i} value={`item-${i}`}>
          <Accordion.Trigger>Item {i + 1}</Accordion.Trigger>
          <Accordion.Content>Content for item {i + 1}.</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion>
  ),
};

export const CustomTriggers: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: customTriggersCode,
      },
    },
  },
  render: () => (
    <Accordion
      type="single"
      collapsible
      className="w-full min-w-(--container-md) max-w-(--container-md)"
    >
      <Accordion.Item value="profile">
        <Accordion.Trigger>
          <span className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              A
            </span>
            Profile Settings
          </span>
        </Accordion.Trigger>
        <Accordion.Content>
          Manage your profile information, avatar, and display name.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="notifications">
        <Accordion.Trigger>
          <span className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-warning text-[10px] font-bold text-warning-foreground">
              B
            </span>
            Notifications
          </span>
        </Accordion.Trigger>
        <Accordion.Content>
          Configure email, push, and in-app notification preferences.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="billing">
        <Accordion.Trigger>
          <span className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-success text-[10px] font-bold text-success-foreground">
              C
            </span>
            Billing & Plans
          </span>
        </Accordion.Trigger>
        <Accordion.Content>
          View your current plan, payment methods, and billing history.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
};

export const CustomContent: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      source: {
        code: customContentCode,
      },
    },
  },
  render: () => (
    <Accordion
      type="single"
      collapsible
      className="w-full min-w-(--container-md) max-w-(--container-md)"
    >
      <Accordion.Item value="search">
        <Accordion.Trigger>Search</Accordion.Trigger>
        <Accordion.Content>
          <div className="flex flex-col gap-3">
            <Input placeholder="Search..." />
            <div className="flex gap-2">
              <Button size="sm" variant="primary">
                Search
              </Button>
              <Button size="sm" variant="outline">
                Clear
              </Button>
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="filters">
        <Accordion.Trigger>Filters</Accordion.Trigger>
        <Accordion.Content>
          <div className="flex flex-wrap gap-2">
            {['Active', 'Pending', 'Draft', 'Archived'].map(label => (
              <Button key={label} size="sm" variant="secondary">
                {label}
              </Button>
            ))}
          </div>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="actions">
        <Accordion.Trigger>Quick Actions</Accordion.Trigger>
        <Accordion.Content>
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="justify-start">
              Export CSV
            </Button>
            <Button variant="outline" className="justify-start">
              Import Data
            </Button>
            <Button variant="destructive" className="justify-start">
              Delete All
            </Button>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
};

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Dialog, DialogStack, useDialogStack } from './dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardSlider } from '@/components/card';

function WizardStep({
  order,
  title,
  onClose,
  isFirst,
  isLast,
  children,
}: {
  order: number;
  title: string;
  onClose: () => void;
  isFirst: boolean;
  isLast: boolean;
  children: React.ReactNode;
}) {
  const { next, back } = useDialogStack();

  const actions = [
    ...(!isFirst ? [{ label: 'Back', onClick: back, variant: 'outline' as const }] : []),
    {
      label: isLast ? 'Finish' : 'Next',
      onClick: isLast ? onClose : next,
      variant: 'primary' as const,
    },
  ];

  return (
    <Dialog
      order={order}
      onOpenChange={isFirst ? onClose : undefined}
      title={title}
      actions={actions}
      removeOverlay={!isFirst}
    >
      {children}
    </Dialog>
  );
}

const meta: Meta<typeof Dialog> = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onOpenChange: fn(),
  },
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  render: function Render() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Dialog
          isOpen={open}
          onOpenChange={setOpen}
          title="Dialog Title"
          description="This is a description of the dialog."
          showDescription
          hideMobileFooterClose
          actions={[
            { label: 'Cancel', onClick: () => setOpen(false), variant: 'outline' },
            { label: 'Confirm', onClick: () => setOpen(false) },
          ]}
        >
          <p className="text-muted-foreground text-sm">Dialog content goes here. You can put any React node inside.</p>
        </Dialog>
      </>
    );
  },
};

export const Destructive: StoryObj<typeof meta> = {
  render: function Render() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>Delete Item</Button>
        <Dialog
          isOpen={open}
          onOpenChange={setOpen}
          title="Delete Item"
          description="Are you sure you want to delete this item? This action cannot be undone."
          showDescription
          actions={[
            { label: 'Cancel', onClick: () => setOpen(false), variant: 'outline' },
            { label: 'Delete', onClick: () => setOpen(false), variant: 'destructive' },
          ]}
          classNames={{
            content: 'bg-destructive/5',
          }}
        >
          <p className="text-sm text-destructive font-medium">Item #1234 will be permanently removed.</p>
        </Dialog>
      </>
    );
  },
};

export const WithForm: StoryObj<typeof meta> = {
  render: function Render() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Create Project</Button>
        <Dialog
          isOpen={open}
          onOpenChange={setOpen}
          title="Create Project"
          description="Fill in the details to create a new project."
          showDescription
          actions={[
            { label: 'Cancel', onClick: () => setOpen(false), variant: 'outline' },
            { label: 'Create', onClick: () => setOpen(false), variant: 'primary' },
          ]}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Project Name</Label>
              <Input id="name" placeholder="My project" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="desc">Description</Label>
              <Input id="desc" placeholder="Optional description" />
            </div>
          </div>
        </Dialog>
      </>
    );
  },
};

export const StackSteps: StoryObj<typeof meta> = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Setup Wizard</Button>
        {open && (
          <DialogStack defaultIndex={0}>
            <WizardStep order={0} title="Step 1: Account" onClose={close} isFirst isLast={false}>
              <p className="text-muted-foreground text-sm">Create your account details.</p>
              <Input placeholder="Email address" />
            </WizardStep>
            <WizardStep order={1} title="Step 2: Profile" onClose={close} isFirst={false} isLast={false}>
              <p className="text-muted-foreground text-sm">Set up your profile information.</p>
              <Input placeholder="Display name" />
            </WizardStep>
            <WizardStep order={2} title="Step 3: Confirmation" onClose={close} isFirst={false} isLast>
              <p className="text-muted-foreground text-sm">Review and confirm your setup.</p>
              <div className="rounded-lg border p-3 text-sm">
                <p className="font-medium">Summary</p>
                <p className="text-muted-foreground">Everything looks good!</p>
              </div>
            </WizardStep>
          </DialogStack>
        )}
      </>
    );
  },
};

export const NoOverlay: StoryObj<typeof meta> = {
  render: function Render() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>Open Sheet</Button>
        <Dialog
          isOpen={open}
          onOpenChange={setOpen}
          title="Sheet Dialog"
          overlay={false}
          actions={[
            { label: 'Done', onClick: () => setOpen(false), variant: 'primary' },
          ]}
        >
          <p className="text-muted-foreground text-sm">This dialog has no backdrop overlay, appearing more like a sheet.</p>
        </Dialog>
      </>
    );
  },
};

export const ScrollableContent: StoryObj<typeof meta> = {
  render: function Render() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>View Terms</Button>
        <Dialog
          isOpen={open}
          onOpenChange={setOpen}
          title="Terms of Service"
          actions={[
            { label: 'Decline', onClick: () => setOpen(false), variant: 'outline' },
            { label: 'Accept', onClick: () => setOpen(false), variant: 'primary' },
          ]}
        >
          <div className="flex flex-col gap-4 text-sm text-muted-foreground">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i}>
                <h4 className="font-semibold text-foreground mb-1">Section {i + 1}</h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            ))}
          </div>
        </Dialog>
      </>
    );
  },
};

export const WithCardSlider: StoryObj<typeof meta> = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);

    const goToStep = (index: number) => setStepIndex(index);
    const goBack = () => setStepIndex(0);

    return (
      <>
        <Button onClick={() => { setStepIndex(0); setOpen(true); }}>New Project</Button>
        <Dialog
          isOpen={open}
          onOpenChange={(v) => { setOpen(v); if (!v) setStepIndex(0); }}
          title={stepIndex === 0 ? 'New Project' : 'Create Client'}
          hideMobileFooterClose={stepIndex > 0}
          actions={
            stepIndex === 0
              ? [
                  { label: 'Cancel', onClick: () => setOpen(false), variant: 'outline' },
                  { label: 'Next', onClick: () => goToStep(1), variant: 'primary' },
                ]
              : [
                  { label: 'Back', onClick: goBack, variant: 'outline' },
                  { label: 'Save', onClick: () => setOpen(false), variant: 'primary' },
                ]
          }
          classNames={{ content: 'p-0' }}
        >
            <CardSlider index={stepIndex}>
              <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="project">Project Name</Label>
                  <Input id="project" placeholder="My project" />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="desc">Description</Label>
                  <Input id="desc" placeholder="Brief description" />
                </div>

                <Button
                  variant="secondary"
                  className="justify-start h-auto py-3 px-4"
                  onClick={() => goToStep(1)}
                >
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium">Create new client</span>
                    <span className="text-xs text-muted-foreground">Add a client and assign to this project</span>
                  </div>
                </Button>
              </div>

              <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input id="clientName" placeholder="John Doe" />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input id="clientEmail" placeholder="john@example.com" />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="clientPhone">Phone</Label>
                  <Input id="clientPhone" placeholder="+55 11 99999-9999" />
                </div>
              </div>
            </CardSlider>
        </Dialog>
      </>
    );
  },
};

import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from './marquee'

const meta: Meta<typeof Marquee> = {
  title: 'Blocks/Marquee',
  component: Marquee,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof meta>

const Logos = () => (
  <>
    {['React', 'Vue', 'Svelte', 'Angular', 'Next.js', 'Nuxt', 'Remix', 'Astro'].map((name) => (
      <MarqueeItem key={name}>
        <div className="flex h-16 w-28 items-center justify-center rounded-lg border bg-card text-sm font-medium text-card-foreground">
          {name}
        </div>
      </MarqueeItem>
    ))}
  </>
)

export const Default: Story = {
  render: () => (
    <Marquee className="w-full max-w-xl">
      <MarqueeContent>
        <Logos />
      </MarqueeContent>
    </Marquee>
  ),
}

export const WithFade: Story = {
  render: () => (
    <Marquee className="w-full max-w-xl">
      <MarqueeContent>
        <Logos />
      </MarqueeContent>
      <MarqueeFade side="left" />
      <MarqueeFade side="right" />
    </Marquee>
  ),
}

export const Reverse: Story = {
  render: () => (
    <Marquee className="w-full max-w-xl">
      <MarqueeContent direction="right">
        <Logos />
      </MarqueeContent>
    </Marquee>
  ),
}

export const Speed: Story = {
  render: () => (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <div className="rounded-lg border bg-muted/30 py-2">
        <Marquee>
          <MarqueeContent speed={20}>
            <Logos />
          </MarqueeContent>
        </Marquee>
      </div>
      <div className="rounded-lg border bg-muted/30 py-2">
        <Marquee>
          <MarqueeContent speed={60}>
            <Logos />
          </MarqueeContent>
        </Marquee>
      </div>
      <div className="rounded-lg border bg-muted/30 py-2">
        <Marquee>
          <MarqueeContent speed={120}>
            <Logos />
          </MarqueeContent>
        </Marquee>
      </div>
    </div>
  ),
}

export const WithLinks: Story = {
  render: () => (
    <Marquee className="w-full max-w-xl">
      <MarqueeContent>
        <MarqueeItem href="https://react.dev">
          <div className="flex h-12 w-24 items-center justify-center rounded-lg border bg-card text-sm font-medium text-card-foreground hover:bg-accent">
            React
          </div>
        </MarqueeItem>
        <MarqueeItem href="https://vuejs.org">
          <div className="flex h-12 w-24 items-center justify-center rounded-lg border bg-card text-sm font-medium text-card-foreground hover:bg-accent">
            Vue
          </div>
        </MarqueeItem>
        <MarqueeItem href="https://svelte.dev">
          <div className="flex h-12 w-24 items-center justify-center rounded-lg border bg-card text-sm font-medium text-card-foreground hover:bg-accent">
            Svelte
          </div>
        </MarqueeItem>
        <MarqueeItem href="https://angular.dev">
          <div className="flex h-12 w-24 items-center justify-center rounded-lg border bg-card text-sm font-medium text-card-foreground hover:bg-accent">
            Angular
          </div>
        </MarqueeItem>
        <MarqueeItem href="https://nextjs.org">
          <div className="flex h-12 w-24 items-center justify-center rounded-lg border bg-card text-sm font-medium text-card-foreground hover:bg-accent">
            Next.js
          </div>
        </MarqueeItem>
        <MarqueeItem href="https://astro.build">
          <div className="flex h-12 w-24 items-center justify-center rounded-lg border bg-card text-sm font-medium text-card-foreground hover:bg-accent">
            Astro
          </div>
        </MarqueeItem>
      </MarqueeContent>
    </Marquee>
  ),
}

export const Gradient: Story = {
  render: () => (
    <Marquee className="w-full max-w-xl">
      <MarqueeContent gradient gradientColor="var(--color-background)" gradientWidth={100}>
        <Logos />
      </MarqueeContent>
    </Marquee>
  ),
}

export const PauseOnHover: Story = {
  render: () => (
    <Marquee className="w-full max-w-xl">
      <MarqueeContent pauseOnHover>
        <Logos />
      </MarqueeContent>
      <MarqueeFade side="left" />
      <MarqueeFade side="right" />
    </Marquee>
  ),
}

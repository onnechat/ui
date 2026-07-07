import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { EmojiPicker } from './emoji-picker';

const meta: Meta<typeof EmojiPicker> = {
  title: 'UI/EmojiPicker',
  component: EmojiPicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', 'new'],
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  render: () => (
    <EmojiPicker onEmojiSelect={({ emoji }) => console.log(emoji)}>
      <EmojiPicker.Search />
      <EmojiPicker.Viewport>
        <EmojiPicker.Loading />
        <EmojiPicker.Empty />
        <EmojiPicker.List />
      </EmojiPicker.Viewport>
    </EmojiPicker>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByPlaceholderText('Search emoji...')).toBeInTheDocument();
  },
};

export const WithFooter: StoryObj<typeof meta> = {
  render: () => (
    <EmojiPicker onEmojiSelect={({ emoji }) => console.log(emoji)}>
      <EmojiPicker.Search />
      <EmojiPicker.Viewport>
        <EmojiPicker.Loading />
        <EmojiPicker.Empty />
        <EmojiPicker.List />
      </EmojiPicker.Viewport>
      <EmojiPicker.Footer>
        <EmojiPicker.SkinToneSelector />
        <EmojiPicker.ActiveEmoji>
          {({ emoji }) => (
            <span>{emoji ? `${emoji.emoji} ${emoji.label}` : 'Pick an emoji'}</span>
          )}
        </EmojiPicker.ActiveEmoji>
      </EmojiPicker.Footer>
    </EmojiPicker>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Pick an emoji')).toBeInTheDocument();
  },
};

export const WithCategorySelector: StoryObj<typeof meta> = {
  render: () => (
    <EmojiPicker onEmojiSelect={({ emoji }) => console.log(emoji)}>
      <EmojiPicker.Search />
      <EmojiPicker.CategorySelector />
      <EmojiPicker.Viewport>
        <EmojiPicker.Loading />
        <EmojiPicker.Empty />
        <EmojiPicker.List />
      </EmojiPicker.Viewport>
      <EmojiPicker.Footer>
        <EmojiPicker.SkinToneSelector />
        <EmojiPicker.ActiveEmoji>
          {({ emoji }) => (
            <span>{emoji ? `${emoji.emoji} ${emoji.label}` : 'Pick an emoji'}</span>
          )}
        </EmojiPicker.ActiveEmoji>
      </EmojiPicker.Footer>
    </EmojiPicker>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: 'Food & Drink' }),
    ).toBeInTheDocument();
  },
};

export const Compact: StoryObj<typeof meta> = {
  render: () => (
    <EmojiPicker
      className="h-72"
      columns={8}
      onEmojiSelect={({ emoji }) => console.log(emoji)}
    >
      <EmojiPicker.Search />
      <EmojiPicker.Viewport>
        <EmojiPicker.List />
      </EmojiPicker.Viewport>
    </EmojiPicker>
  ),
};

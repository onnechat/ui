import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import {
  VideoPlayer,
  VideoPlayerControlBar,
  VideoPlayerTimeRange,
  VideoPlayerTimeDisplay,
  VideoPlayerVolumeRange,
  VideoPlayerPlayButton,
  VideoPlayerSeekBackwardButton,
  VideoPlayerSeekForwardButton,
  VideoPlayerMuteButton,
  VideoPlayerContent,
} from './video-player';

const SAMPLE_VIDEO = '/video.mp4';

const meta: Meta<typeof VideoPlayer> = {
  title: 'UI/VideoPlayer',
  component: VideoPlayer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    className: 'w-full min-w-(--container-md) max-w-(--container-md) aspect-video',
  },
};

export default meta;

export const Default: StoryObj<typeof meta> = {
  render: (args) => (
    <VideoPlayer {...args}>
      <VideoPlayerContent
        slot="media"
        src={SAMPLE_VIDEO}
        preload="metadata"
      />
      <VideoPlayerControlBar className="w-full">
        <VideoPlayerPlayButton />
        <VideoPlayerSeekBackwardButton />
        <VideoPlayerSeekForwardButton />
        <VideoPlayerTimeDisplay />
        <VideoPlayerTimeRange className="flex-1" />
        <VideoPlayerMuteButton />
        <VideoPlayerVolumeRange />
      </VideoPlayerControlBar>
    </VideoPlayer>
  ),
  play: async ({ canvas }) => {
    const el = document.querySelector('media-controller');
    await expect(el).toBeInTheDocument();
  },
};

export const Minimal: StoryObj<typeof meta> = {
  render: (args) => (
    <VideoPlayer {...args}>
      <VideoPlayerContent
        slot="media"
        src={SAMPLE_VIDEO}
        preload="metadata"
      />

      <VideoPlayerControlBar className="w-full">
        <VideoPlayerPlayButton />
        <VideoPlayerTimeRange className="flex-1" />
        <VideoPlayerTimeDisplay />
      </VideoPlayerControlBar>
    </VideoPlayer>
  ),
  play: async ({ canvas }) => {
    const el = document.querySelector('media-controller');
    await expect(el).toBeInTheDocument();
  },
};

export const NoControls: StoryObj<typeof meta> = {
  render: (args) => (
    <VideoPlayer {...args}>
      <VideoPlayerContent
        slot="media"
        src={SAMPLE_VIDEO}
        preload="metadata"
      />
    </VideoPlayer>
  ),
  play: async () => {
    const el = document.querySelector('media-controller');
    await expect(el).toBeInTheDocument();
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
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
  title: 'Blocks/VideoPlayer',
  component: VideoPlayer,
  subcomponents: {
    VideoPlayerContent,
    VideoPlayerControlBar,
    VideoPlayerPlayButton,
    VideoPlayerSeekBackwardButton,
    VideoPlayerSeekForwardButton,
    VideoPlayerTimeDisplay,
    VideoPlayerTimeRange,
    VideoPlayerMuteButton,
    VideoPlayerVolumeRange,
  } as Meta<typeof VideoPlayer>['subcomponents'],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    audio: {
      control: 'boolean',
      description: 'Modo áudio: player compacto, sem a área de vídeo.',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: 'false' },
      },
    },
    autohide: {
      control: 'text',
      description:
        'Segundos de inatividade até esconder os controles; `-1` desativa.',
      table: { category: 'Comportamento' },
    },
    gesturesDisabled: {
      control: 'boolean',
      description: 'Desativa os gestos no vídeo (clique para play/pause).',
      table: {
        category: 'Comportamento',
        defaultValue: { summary: 'false' },
      },
    },
    defaultStreamType: {
      control: 'inline-radio',
      options: ['on-demand', 'live'],
      description:
        'Tipo de stream assumido antes de a mídia carregar os metadados.',
      table: { category: 'Comportamento' },
    },
    className: {
      control: 'text',
      description: 'Classes extras aplicadas ao container do player.',
      table: { category: 'Aparência' },
    },
    children: {
      control: false,
      description:
        'Composição com `VideoPlayerContent` (slot `media`) e a barra de controles.',
      table: { category: 'Conteúdo' },
    },
  },
  args: {
    className:
      'w-full min-w-(--container-md) max-w-(--container-md) aspect-video',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: args => (
    <VideoPlayer {...args}>
      <VideoPlayerContent slot="media" src={SAMPLE_VIDEO} preload="metadata" />
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
};

export const Minimal: Story = {
  render: args => (
    <VideoPlayer {...args}>
      <VideoPlayerContent slot="media" src={SAMPLE_VIDEO} preload="metadata" />

      <VideoPlayerControlBar className="w-full">
        <VideoPlayerPlayButton />
        <VideoPlayerTimeRange className="flex-1" />
        <VideoPlayerTimeDisplay />
      </VideoPlayerControlBar>
    </VideoPlayer>
  ),
};

export const NoControls: Story = {
  render: args => (
    <VideoPlayer {...args}>
      <VideoPlayerContent slot="media" src={SAMPLE_VIDEO} preload="metadata" />
    </VideoPlayer>
  ),
};

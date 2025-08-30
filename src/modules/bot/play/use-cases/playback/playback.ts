import { PlayMusic } from '@/domain/use-cases/play/play-music';
import { MusicSessionRepository } from '@/infra/music-session/music-session-repository';
import {
  AudioPlayerStatus,
  createAudioPlayer,
  joinVoiceChannel,
  NoSubscriberBehavior,
} from '@discordjs/voice';
import { VoiceBasedChannel } from 'discord.js';

export interface PlayBack {
  play(voiceChannel: VoiceBasedChannel): Promise<void>;
  notifyMusicSkipped(voiceChannelId: string): void;
}

export class PlayBackUseCase implements PlayBack {
  private currentPlayingMusic: Map<string, string> = new Map();

  constructor(
    private readonly playMusicUseCase: PlayMusic,
    private readonly musicSessionRepository: MusicSessionRepository,
  ) {}

  async play(voiceChannel: VoiceBasedChannel): Promise<void> {
    const { id: voiceChannelId } = voiceChannel;

    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Play,
      },
    });

    const connection = joinVoiceChannel({
      channelId: voiceChannelId,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    const newSessionMusic = {
      player,
      connection,
    };

    this.musicSessionRepository.update(voiceChannelId, newSessionMusic);

    await this.playMusicUseCase.play(voiceChannelId);

    const currentSession = this.musicSessionRepository.load(voiceChannelId);
    const currentMusicId = currentSession?.queue?.[0]?.id;

    if (currentMusicId) {
      this.currentPlayingMusic.set(voiceChannelId, currentMusicId);
    }

    player.on(AudioPlayerStatus.Idle, async () => {
      const currentSession = this.musicSessionRepository.load(voiceChannelId);
      if (!currentSession) {
        this.currentPlayingMusic.delete(voiceChannelId);
        return;
      }

      const musicThatJustFinished = currentSession.queue?.[0]?.id;
      const musicThatWasPlaying = this.currentPlayingMusic.get(voiceChannelId);

      if (musicThatJustFinished !== musicThatWasPlaying) {
        return;
      }

      currentSession.queue?.shift();

      if (!currentSession.queue?.length) {
        setTimeout(() => {
          const stillEmpty = this.musicSessionRepository.load(voiceChannelId);

          if (stillEmpty && !stillEmpty.queue?.length) {
            stillEmpty?.connection?.destroy();
            this.musicSessionRepository.delete(voiceChannelId);
            this.currentPlayingMusic.delete(voiceChannelId);
          }
        }, 60000);
        return;
      }

      const nextMusicId = currentSession.queue?.[0]?.id;
      if (nextMusicId) {
        this.currentPlayingMusic.set(voiceChannelId, nextMusicId);
      }

      await this.playMusicUseCase.play(voiceChannelId);
    });
  }

  notifyMusicSkipped(voiceChannelId: string): void {
    const currentSession = this.musicSessionRepository.load(voiceChannelId);
    if (currentSession?.queue?.length) {
      const newCurrentMusicId = currentSession.queue[0]?.id;
      if (newCurrentMusicId) {
        this.currentPlayingMusic.set(voiceChannelId, newCurrentMusicId);
      }
    } else {
      this.currentPlayingMusic.delete(voiceChannelId);
    }
  }
}

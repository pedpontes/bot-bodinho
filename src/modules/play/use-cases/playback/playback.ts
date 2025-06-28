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
}

export class PlayBackUseCase implements PlayBack {
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

    const updatedSession = this.musicSessionRepository.update(
      voiceChannelId,
      newSessionMusic,
    );

    await this.playMusicUseCase.play(voiceChannelId);

    player.on(AudioPlayerStatus.Idle, async () => {
      const currentSession = this.musicSessionRepository.load(voiceChannelId);
      if (!currentSession) return;

      currentSession.queue?.shift();

      if (!currentSession.queue?.length) {
        setTimeout(() => {
          const stillEmpty = this.musicSessionRepository.load(voiceChannelId);

          if (stillEmpty && !stillEmpty.queue?.length) {
            stillEmpty?.connection?.destroy();
            this.musicSessionRepository.delete(voiceChannelId);
          }
        }, 60000);
        return;
      }

      await this.playMusicUseCase.play(voiceChannelId);
    });
  }
}

import { PlayMusic } from '@/domain/use-cases/play/play-music';
import { MusicSession, musicSessions } from '@/states/music-session';
import {
  AudioPlayerStatus,
  createAudioPlayer,
  joinVoiceChannel,
  NoSubscriberBehavior,
} from '@discordjs/voice';
import { VoiceBasedChannel } from 'discord.js';

export interface PlayBack {
  play(session: MusicSession, voiceChannel: VoiceBasedChannel): Promise<void>;
}

export class PlayBackUseCase implements PlayBack {
  constructor(private readonly playMusicUseCase: PlayMusic) {}

  async play(
    session: MusicSession,
    voiceChannel: VoiceBasedChannel,
  ): Promise<void> {
    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Play,
      },
    });

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    const voiceChannelId = voiceChannel.id;

    const newSessionMusic = {
      ...session,
      player,
      connection,
    };

    musicSessions[voiceChannel.id] = newSessionMusic;

    await this.playMusicUseCase.play(newSessionMusic);

    player.on(AudioPlayerStatus.Idle, async () => {
      const currentSession = musicSessions[voiceChannelId];
      if (!currentSession) return;

      currentSession.queue?.shift();

      if (!currentSession.queue?.length) {
        setTimeout(() => {
          const stillEmpty = musicSessions[voiceChannelId];
          if (!stillEmpty?.queue?.length) {
            stillEmpty.connection?.destroy();
            delete musicSessions[voiceChannelId];
          }
        }, 60000);
        return;
      }

      await this.playMusicUseCase.play(currentSession);
    });

    await this.playMusicUseCase.play(newSessionMusic);
  }
}

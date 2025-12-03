import { VoiceBasedChannel } from 'discord.js';
import { MusicSessionRepository } from '@/infra/local/music-session/music-session-repository';
import { AddMusicToSessionUseCase } from '@/modules/bot/play/use-cases/add-music-to-session';
import { PlayBackUseCase } from '@/modules/bot/play/use-cases/playback/playback';
import { getClient } from '@/main/bot-app';
import path from 'path';

export interface PlayUploadMusic {
  execute(filePath: string, discordId: string, filename: string): Promise<void>;
}

export class PlayUploadMusicUseCase implements PlayUploadMusic {
  constructor(
    private readonly musicSessionRepository: MusicSessionRepository,
    private readonly addMusicToSessionUseCase: AddMusicToSessionUseCase,
    private readonly playBackUseCase: PlayBackUseCase,
  ) {}

  async execute(
    filePath: string,
    discordId: string,
    filename: string,
  ): Promise<void> {
    const client = getClient();

    if (!client) {
      throw new Error('Bot do Discord não está inicializado');
    }

    const guilds = client.guilds.cache;
    let voiceChannel: VoiceBasedChannel | null = null;

    for (const guild of guilds.values()) {
      const member = await guild.members.fetch(discordId).catch(() => null);
      if (member?.voice.channel) {
        voiceChannel = member.voice.channel;
        break;
      }
    }

    if (!voiceChannel) {
      throw new Error('Você precisa estar em um canal de voz');
    }

    let session = this.musicSessionRepository.load(voiceChannel.id);

    if (!session) {
      session = this.musicSessionRepository.add(voiceChannel.id, {
        connection: undefined,
        player: undefined,
        queue: [],
      });
    }

    const isPlaying = session.queue && session.queue.length > 0;

    await this.addMusicToSessionUseCase.add(voiceChannel.id, [
      {
        url: `file://${path.resolve(filePath)}`,
        title: filename,
        thumbnail: '',
      },
    ]);

    if (!isPlaying) {
      await this.playBackUseCase.play(voiceChannel);
    }
  }
}

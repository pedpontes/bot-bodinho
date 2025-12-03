import { MusicModel } from '@/domain/interfaces/music';
import { MusicSessionRepository } from '@/infra/local/music-session/music-session-repository';
import { UserRepository } from '@/infra/prisma/user-repository';
import { getClient } from '@/main/bot-app';
import { getVoiceConnection } from '@discordjs/voice';
import { VoiceBasedChannel } from 'discord.js';

export type LoadQueueByUserResponse = {
  explaned: 'connected' | 'disconnected';
  queue: MusicModel[];
};

export interface LoadQueueByUser {
  execute(userId: string): Promise<LoadQueueByUserResponse>;
}

export class LoadQueueByUserUseCase implements LoadQueueByUser {
  constructor(
    private readonly musicSessionRepository: MusicSessionRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string): Promise<LoadQueueByUserResponse> {
    const user = await this.userRepository.loadByIdWithDiscordAuth(userId);

    if (!user || !user.discordAuth) {
      return {
        explaned: 'disconnected',
        queue: [],
      };
    }

    const client = getClient();

    if (!client) {
      return {
        explaned: 'disconnected',
        queue: [],
      };
    }

    const discordId = user.discordAuth.discordId;
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
      return {
        explaned: 'disconnected',
        queue: [],
      };
    }

    const connection = getVoiceConnection(voiceChannel.guild.id);

    if (!connection || connection.joinConfig.channelId !== voiceChannel.id) {
      return {
        explaned: 'connected',
        queue: [],
      };
    }

    const session = this.musicSessionRepository.load(voiceChannel.id);

    return {
      explaned: 'connected',
      queue: session?.queue || [],
    };
  }
}

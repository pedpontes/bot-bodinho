import { PrismaClient } from '@prisma/client';
import client from './main';
import { MusicModel } from '../interfaces/music';

export class ChannelRepository {
  private readonly client: PrismaClient;
  constructor() {
    this.client = client;
  }

  async create(channelId: string) {
    return this.client.channel.create({
      data: {
        channelVoiceId: channelId,
      },
    });
  }

  async loadByChannelId(channelId: string) {
    return this.client.channel.findFirst({
      where: {
        channelVoiceId: channelId,
      },
      include: {
        queeue: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
  }
}

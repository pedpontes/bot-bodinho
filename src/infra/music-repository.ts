import { PrismaClient } from '@prisma/client';
import client from '../services/prisma';

export class MusicRepository {
  private readonly client: PrismaClient;
  constructor() {
    this.client = client;
  }

  async create(channelId: string, url: string) {
    return this.client.music.create({
      data: {
        url,
        channelId,
      },
    });
  }

  async loadByChannelId(channelId: string) {
    return this.client.music.findMany({
      where: {
        channelId,
      },
    });
  }

  async deleteById(id: string) {
    return this.client.music.deleteMany({
      where: {
        id,
      },
    });
  }

  async deleteAllByChannelId(channelId: string) {
    return this.client.music.deleteMany({
      where: {
        channelId,
      },
    });
  }
}

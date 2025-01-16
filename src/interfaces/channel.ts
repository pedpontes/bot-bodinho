import { Music } from '@prisma/client';

export interface ChannelModel {
  id: string;
  name?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  guildId: string;
  queeue?: Music[];
}

import { MusicModel } from './music';

export interface ChannelModel {
  id: string;
  name?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  guildId: string;
  queeue?: MusicModel[];
}

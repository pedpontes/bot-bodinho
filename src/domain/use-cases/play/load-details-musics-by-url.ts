import { MusicDetails } from '@/domain/interfaces/music';
import { VoiceBasedChannel } from 'discord.js';

export interface LoadDetailsMusicsByUrl {
  load(url: string, voiceChannel: VoiceBasedChannel): Promise<MusicDetails[]>;
}

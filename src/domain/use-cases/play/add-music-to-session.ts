import { MusicDetails } from '@/domain/interfaces/music';
import { VoiceBasedChannel } from 'discord.js';

export interface AddMusicToSession {
  add(voiceChannel: VoiceBasedChannel, musics: MusicDetails[]): Promise<void>;
}

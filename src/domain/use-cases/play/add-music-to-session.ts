import { MusicDetails } from '@/domain/interfaces/music';
import { MusicSession } from '@/states/music-session';
import { VoiceBasedChannel } from 'discord.js';

export interface AddMusicToSession {
  add(
    id: VoiceBasedChannel['id'],
    musics: MusicDetails[],
  ): Promise<MusicSession>;
}

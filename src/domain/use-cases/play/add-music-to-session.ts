import { MusicDetails } from '@/modules/play/use-cases/load-details-musics-by-url';
import { VoiceBasedChannel } from 'discord.js';

export interface AddMusicToSession {
  add(
    voiceChannel: VoiceBasedChannel,
    musics: MusicDetails[],
  ): Promise<boolean>;
}

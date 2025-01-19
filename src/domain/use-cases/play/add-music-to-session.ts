import { VoiceBasedChannel } from 'discord.js';

export interface AddMusicToSession {
  add(voiceChannel: VoiceBasedChannel, url: string): Promise<boolean>;
}

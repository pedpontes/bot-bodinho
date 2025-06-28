import { VoiceBasedChannel } from 'discord.js';

export interface PlayMusic {
  play(id: VoiceBasedChannel['id']): Promise<void>;
}

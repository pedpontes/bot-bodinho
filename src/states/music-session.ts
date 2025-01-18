import { Queeue } from '../commands/utility/play';
import { AudioPlayer, VoiceConnection } from '@discordjs/voice';

export type MusicSession = {
  player?: AudioPlayer;
  connection?: VoiceConnection;
  queue?: Queeue[];
};

export const musicSessions: Record<string, MusicSession> = {};

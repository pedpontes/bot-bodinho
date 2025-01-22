import { AudioPlayer, VoiceConnection } from '@discordjs/voice';
import { MusicModel } from '../domain/interfaces/music';

export type MusicSession = {
  player?: AudioPlayer;
  connection?: VoiceConnection;
  queue?: MusicModel[];
};

export const musicSessions: Record<string, MusicSession> = {};

import { AudioPlayer, VoiceConnection } from '@discordjs/voice';
import { ChildProcessWithoutNullStreams } from 'node:child_process';
import { MusicModel } from '../domain/interfaces/music';

export type MusicSession = {
  player?: AudioPlayer;
  connection?: VoiceConnection;
  queue?: MusicModel[];
  proc?: ChildProcessWithoutNullStreams | null;
};

export const musicSessions: Record<string, MusicSession> = {};

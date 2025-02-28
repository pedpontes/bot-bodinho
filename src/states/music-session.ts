import { AudioPlayer, VoiceConnection } from '@discordjs/voice';
import { VoiceBasedChannel } from 'discord.js';
import { MusicModel } from '../domain/interfaces/music';

export type MusicSession = {
  voiceChannel?: VoiceBasedChannel | null;
  player?: AudioPlayer;
  connection?: VoiceConnection;
  queue?: MusicModel[];
};

export const musicSessions: Record<string, MusicSession> = {};

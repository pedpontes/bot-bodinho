import { MusicSession, musicSessions } from '@/states/music-session';
import { VoiceBasedChannel } from 'discord.js';

export interface MusicSessionRepository {
  add(id: string, session: MusicSession): MusicSession;
  load(id: string): MusicSession | undefined;
  delete(id: string): void;
  loadAll(): Record<string, MusicSession>;
  update(id: string, session: MusicSession): MusicSession;
}

export class MusicSessionStateRepository implements MusicSessionRepository {
  constructor() {}

  add(id: VoiceBasedChannel['id'], session: MusicSession): MusicSession {
    musicSessions[id] = session;
    return musicSessions[id];
  }

  load(id: VoiceBasedChannel['id']): MusicSession | undefined {
    return musicSessions[id];
  }

  delete(id: VoiceBasedChannel['id']): void {
    delete musicSessions[id];
  }

  loadAll(): Record<VoiceBasedChannel['id'], MusicSession> {
    return musicSessions;
  }

  update(id: VoiceBasedChannel['id'], session: MusicSession): MusicSession {
    if (!musicSessions[id]) {
      throw new Error(`Session with id ${id} does not exist.`);
    }
    musicSessions[id] = {
      ...musicSessions[id],
      ...session,
    };

    return musicSessions[id];
  }
}

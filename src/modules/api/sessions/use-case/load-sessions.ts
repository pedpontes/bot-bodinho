import { MusicSessionRepository } from '@/infra/music-session/music-session-repository';
import { MusicSession } from '@/states/music-session';

export interface LoadSessions {
  loadAll: () => Promise<Record<string, MusicSession>>;
  load: (id: string) => Promise<MusicSession | null>;
}

export class LoadSessionsUseCase implements LoadSessions {
  constructor(private readonly sessionRepository: MusicSessionRepository) {}

  async loadAll(): Promise<Record<string, MusicSession>> {
    return this.sessionRepository.loadAll();
  }

  async load(id: string): Promise<MusicSession | null> {
    return this.sessionRepository.load(id) ?? null;
  }
}

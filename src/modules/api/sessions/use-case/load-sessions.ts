import { SessionModel } from '@/domain/interfaces/sessions';
import { MusicSessionRepository } from '@/infra/local/music-session/music-session-repository';

export interface LoadSessions {
  loadAll: () => Promise<any>;
  load: (id: string) => Promise<any>;
}

export class LoadSessionsUseCase implements LoadSessions {
  constructor(private readonly sessionRepository: MusicSessionRepository) {}

  async loadAll(): Promise<SessionModel[]> {
    const sessions = this.sessionRepository.loadAll();
    return sessions
      ? Object.entries(sessions).map(([id, session]) => ({
          id: id,
          hasPlayer: !!session.player,
          hasConnection: !!session.connection,
          queueLength: session.queue?.length || 0,
          playerStatus: session.player?.state?.status || 'idle',
        }))
      : [];
  }

  async load(id: string): Promise<SessionModel | null> {
    const session = this.sessionRepository.load(id);
    if (!session) return null;

    return {
      id: id,
      hasPlayer: !!session.player,
      hasConnection: !!session.connection,
      queueLength: session.queue?.length || 0,
      playerStatus: session.player?.state?.status || 'idle',
    };
  }
}

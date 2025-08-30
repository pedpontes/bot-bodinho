import { MusicSessionStateRepository } from '@/infra/music-session/music-session-repository';
import { LoadSessionsController } from '@/modules/api/sessions/controller/load-sessions';
import { LoadSessionsUseCase } from '@/modules/api/sessions/use-case/load-sessions';

export const makeLoadSessions = (): LoadSessionsController => {
  return new LoadSessionsController(
    new LoadSessionsUseCase(new MusicSessionStateRepository()),
  );
};

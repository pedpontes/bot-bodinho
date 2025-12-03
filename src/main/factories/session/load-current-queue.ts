import { MusicSessionStateRepository } from '@/infra/local/music-session/music-session-repository';
import { UserPrismaRepository } from '@/infra/prisma/user-repository';
import { LoadCurrentQueueController } from '@/modules/api/sessions/controller/load-current-queue';
import { LoadQueueByUserUseCase } from '@/modules/api/sessions/use-case/load-queue-by-user';

export const makeLoadCurrentQueue =
  (): LoadCurrentQueueController => {
    return new LoadCurrentQueueController(
      new LoadQueueByUserUseCase(
        new MusicSessionStateRepository(),
        new UserPrismaRepository(),
      ),
    );
  };

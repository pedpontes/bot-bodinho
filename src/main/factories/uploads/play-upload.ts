import { MusicSessionStateRepository } from '@/infra/local/music-session/music-session-repository';
import { UploadPrismaRepository } from '@/infra/prisma/upload/upload-prisma-repository';
import { UserPrismaRepository } from '@/infra/prisma/user-repository';
import { PlayUploadController } from '@/modules/api/uploads/controller/play-upload';
import { PlayUploadUseCase } from '@/modules/api/uploads/use-case/play-upload';
import { PlayUploadMusicUseCase } from '@/modules/api/uploads/use-case/play-upload-music';
import { AddMusicToSessionUseCase } from '@/modules/bot/play/use-cases/add-music-to-session';
import { PlayBackUseCase } from '@/modules/bot/play/use-cases/playback/playback';
import { PlayMusicUseCase } from '@/modules/bot/play/use-cases/play-music';
import { YtdlHelper } from '@/services/ytdl';
import { getClient } from '@/main/bot-app';

export const makePlayUploadController = (): PlayUploadController => {
  const musicSessionRepository = new MusicSessionStateRepository();

  return new PlayUploadController(
    new PlayUploadUseCase(
      new UploadPrismaRepository(),
      new UserPrismaRepository(),
    ),
    new PlayUploadMusicUseCase(
      getClient(),
      musicSessionRepository,
      new AddMusicToSessionUseCase(musicSessionRepository),
      new PlayBackUseCase(
        new PlayMusicUseCase(new YtdlHelper(), musicSessionRepository),
        musicSessionRepository,
      ),
    ),
  );
};

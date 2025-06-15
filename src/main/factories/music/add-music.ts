import { MusicSessionStateRepository } from '@/infra/music-session/music-session-repository';
import { AddMusicController } from '@/modules/play/controllers/add-music/add-music';
import { AddMusicToSessionUseCase } from '@/modules/play/use-cases/add-music-to-session';
import { AddMusicUseCase } from '@/modules/play/use-cases/add-music/add-music';
import { LoadDetailsMusicsByUrlUseCase } from '@/modules/play/use-cases/load-details-musics-by-url';
import { LoadUrlScrappingHtmlUseCase } from '@/modules/play/use-cases/load-url-scrapping-html';
import { PlayMusicUseCase } from '@/modules/play/use-cases/play-music';
import { PlayBackUseCase } from '@/modules/play/use-cases/playback/playback';
import { ValidationUrlUseCase } from '@/modules/play/use-cases/validation-url';
import { PuppeteerHelper } from '@/services/puppeteer';
import { YtdlHelper } from '@/services/ytdl';

export const makePlayMusic = (): AddMusicController => {
  return new AddMusicController(
    new AddMusicUseCase(
      new ValidationUrlUseCase(
        new LoadUrlScrappingHtmlUseCase(new PuppeteerHelper()),
        new YtdlHelper(),
      ),
      new LoadDetailsMusicsByUrlUseCase(),
      new AddMusicToSessionUseCase(),
      new PlayBackUseCase(
        new PlayMusicUseCase(new YtdlHelper()),
        new MusicSessionStateRepository(),
      ),
      new MusicSessionStateRepository(),
    ),
  );
};

import { AddMusicController } from '@/modules/play/controllers/add-music/add-music';
import { AddMusicToSessionUseCase } from '@/modules/play/use-cases/add-music-to-session';
import { LoadDetailsMusicsByUrlUseCase } from '@/modules/play/use-cases/load-details-musics-by-url';
import { LoadUrlScrappingHtmlUseCase } from '@/modules/play/use-cases/load-url-scrapping-html';
import { PlayMusicUseCase } from '@/modules/play/use-cases/play-music';
import { ValidationUrlUseCase } from '@/modules/play/use-cases/validation-url';
import { PuppeteerHelper } from '@/services/puppeteer';
import { YtdlHelper } from '@/services/ytdl';

export const makePlayMusic = (): AddMusicController => {
  return new AddMusicController(
    new ValidationUrlUseCase(
      new LoadUrlScrappingHtmlUseCase(new PuppeteerHelper()),
      new YtdlHelper(),
    ),
    new AddMusicToSessionUseCase(),
    new PlayMusicUseCase(),
    new LoadDetailsMusicsByUrlUseCase(),
  );
};

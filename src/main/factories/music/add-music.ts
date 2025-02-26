import { AddMusicController } from '../../../modules/play/controllers/add-music/add-music';
import { AddMusicToSessionUseCase } from '../../../modules/play/use-cases/add-music-to-session';
import { PlayMusicUseCase } from '../../../modules/play/use-cases/play-music';
import { ValidationUrlUseCase } from '../../../modules/play/use-cases/validation-url';
import { YtdlHelper } from '../../../services/ytdl';
import { LoadUrlScrappingHtmlUseCase } from '../../../modules/play/use-cases/load-url-scrapping-html';
import { PuppeteerHelper } from '../../../services/puppeteer';

export const makePlayMusic = (): AddMusicController => {
  return new AddMusicController(
    new ValidationUrlUseCase(
      new LoadUrlScrappingHtmlUseCase(new PuppeteerHelper()),
      new YtdlHelper(),
    ),
    new AddMusicToSessionUseCase(),
    new PlayMusicUseCase(),
  );
};

import { AddMusicController } from '../../../modules/play/controller/add-music/add-music';
import { AddMusicToSessionUseCase } from '../../../modules/play/use-case/add-music-to-session';
import { PlayMusicUseCase } from '../../../modules/play/use-case/play-music';
import { ValidationUrlUseCase } from '../../../modules/play/use-case/validation-url';
import { YtdlHelper } from '../../../services/ytdl';
import { LoadUrlScrappingHtmlUseCase } from '../../../modules/play/use-case/load-url-scrapping-html';
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

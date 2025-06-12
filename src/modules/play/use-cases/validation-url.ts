import { YTProtocols } from '@/services/ytdl';
import { LoadUrlScrappingHtml } from '../../../domain/use-cases/play/load-url-scrapping-html';
import { ValidationUrl } from '../../../domain/use-cases/play/validation-url';

export class ValidationUrlUseCase implements ValidationUrl {
  constructor(
    private readonly loadUrlScrappingHtmlUseCase: LoadUrlScrappingHtml,
    private readonly ytdlHelper: YTProtocols,
  ) {}

  async validate(input: string): Promise<string> {
    let url = input;

    if (!input.includes('https://www.youtube.com')) {
      url = await this.loadUrlScrappingHtmlUseCase.load(input);
    }

    if (!this.ytdlHelper.validateURL(url)) throw new Error('❌ URL inválida!');

    return url;
  }
}

import * as cheerio from 'cheerio';
import { LoadUrlScrappingHtml } from '../../../domain/use-cases/play/load-url-scrapping-html';

export class LoadUrlScrappingHtmlUseCase implements LoadUrlScrappingHtml {
  constructor(private readonly puppeteerHelper: any) {}

  async load(content: string): Promise<string> {
    try {
      const browser = await this.puppeteerHelper.getBrowser();

      const page = await browser.newPage();

      await page.goto(
        `https://www.youtube.com/results?search_query=${content.split(' ').join('+').trim()}`,
        {
          waitUntil: 'networkidle2',
        },
      );

      const html = await page.content();
      const $ = cheerio.load(html);

      const link = $('ytd-video-renderer #dismissible ytd-thumbnail a').attr(
        'href',
      );

      return `https://www.youtube.com${link}`;
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao processar a música!');
    }
  }
}

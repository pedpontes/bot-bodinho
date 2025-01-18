import getBrowser from '../services/puppeteer';
import * as cheerio from 'cheerio';

export default async function loadUrlScrappingHtml(
  content: string,
): Promise<string> {
  try {
    const browser = await getBrowser();

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
    console.error('Erro ao carregar a url:', error);
    return '';
  }
}

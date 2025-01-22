import * as puppeteer from 'puppeteer';

let browser: puppeteer.Browser | null = null;

export class PuppeteerHelper {
  constructor() {}

  async getBrowser() {
    if (!browser) {
      browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }
    return browser;
  }
}

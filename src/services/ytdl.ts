export interface YtService {
  validateURL(url: string): boolean;
}

export class YtdlHelper implements YtService {
  ydtl: any;

  constructor() {
    this.ydtl = require('ytdl-core');
  }

  validateURL(url: string): boolean {
    return this.ydtl.validateURL(url);
  }
}

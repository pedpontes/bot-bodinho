import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process';

export interface YTProtocols {
  validateURL(url: string): boolean;
  loadMusic(url: string): ChildProcessWithoutNullStreams;
}

export class YtdlHelper implements YTProtocols {
  ydtl: any;

  constructor() {
    this.ydtl = require('ytdl-core');
  }

  validateURL(url: string): boolean {
    return this.ydtl.validateURL(url);
  }

  loadMusic(url: string): ChildProcessWithoutNullStreams {
    return spawn('yt-dlp', ['-x', '-q', '-o', '-', url]);
  }
}

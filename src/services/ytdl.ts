import {
  ChildProcessWithoutNullStreams,
  spawn,
  spawnSync,
} from 'node:child_process';

export interface YTProtocols {
  validateURL(url: string): boolean;
  loadMusic(url: string): ChildProcessWithoutNullStreams;
  loadUrlMusic(input: string): string;
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
    return spawn('yt-dlp', [
      '-f',
      'bestaudio[ext=webm]/bestaudio',
      '--quiet',
      '--no-playlist',
      '--no-check-certificate',
      '-o',
      '-',
      url,
    ]);
  }

  loadUrlMusic(input: string): string {
    const args = [
      '--skip-download',
      '--no-playlist',
      '--flat-playlist',
      '--no-warnings',
      '--print',
      'url',
      `ytsearch1:${input}`,
    ];

    const result = spawnSync('yt-dlp', args, { encoding: 'utf-8' });

    if (result.error) {
      throw result.error;
    }

    if (result.status !== 0) {
      throw new Error(`yt-dlp failed: ${result.stderr}`);
    }

    return result.stdout.trim();
  }
}

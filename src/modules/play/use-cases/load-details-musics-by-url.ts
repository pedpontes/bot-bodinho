import { MusicDetails } from '@/domain/interfaces/music';
import { LoadDetailsMusicsByUrl } from '@/domain/use-cases/play/load-details-musics-by-url';
import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process';

export class LoadDetailsMusicsByUrlUseCase implements LoadDetailsMusicsByUrl {
  constructor() {}

  async load(url: string): Promise<MusicDetails[]> {
    return await new Promise((resolve, reject) => {
      const musicDetails: MusicDetails[] = [];
      const { stdout, stderr } = this.spawn(url);

      stderr.on('data', (data) => {
        console.error(data);
        reject(data);
      });

      stdout.on('data', async (data) => {
        const [title, url] = data
          .toString()
          .split(' - ')
          .map((item: string) => item.trim());
        musicDetails.push({ title, url });
      });

      stdout.on('close', () => {
        resolve(musicDetails);
      });
    });
  }

  private spawn(url: string): ChildProcessWithoutNullStreams {
    return spawn('yt-dlp', [
      '--playlist-items',
      '1-10',
      '--print',
      '"%(title)s - %(webpage_url)s"',
      url,
    ]);
  }
}

import { MusicDetails } from '@/domain/interfaces/music';
import { LoadDetailsMusicsByUrl } from '@/domain/use-cases/play/load-details-musics-by-url';
import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process';

export class LoadDetailsMusicsByUrlUseCase implements LoadDetailsMusicsByUrl {
  constructor() {}

  async load(url: string): Promise<MusicDetails[]> {
    return new Promise((resolve, reject) => {
      const musicDetails: MusicDetails[] = [];
      let isFirstItem = true;
      const { stdout, stderr } = this.spawn(url);

      stderr.on('data', (data) => {
        console.error('Erro na execução do yt-dlp:', data.toString());
        reject(new Error(data.toString()));
      });

      stdout.on('data', (data) => {
        const output = data.toString();
        console.log('Output do yt-dlp:', output);

        const [title, url] = output
          .split(' - https://www.youtube.com/watch?v=')
          .map((item: string) => item.trim());

        if (isFirstItem) {
          isFirstItem = false;
          const firstItem = {
            title,
            url: 'https://www.youtube.com/watch?v=' + url,
          };
          musicDetails.push(firstItem);
          resolve(musicDetails);
        } else {
          musicDetails.push({
            title,
            url: 'https://www.youtube.com/watch?v=' + url,
          });
        }
      });

      stdout.on('end', () => {
        if (musicDetails.length === 0) {
          reject(new Error('Nenhuma música encontrada.'));
        }
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

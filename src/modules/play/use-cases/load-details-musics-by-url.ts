import { MusicDetails } from '@/domain/interfaces/music';
import { LoadDetailsMusicsByUrl } from '@/domain/use-cases/play/load-details-musics-by-url';
import { musicSessions } from '@/states/music-session';
import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';

export class LoadDetailsMusicsByUrlUseCase implements LoadDetailsMusicsByUrl {
  constructor() {}

  async load(url: string, channelId: string): Promise<MusicDetails> {
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

        const [title, rest] = output
          .split(' - https://')
          .map((item: string) => item.trim());

        const [url, thumbnail] = rest.split(' - thumbnail: ');

        const music = {
          thumbnail: thumbnail.replace(/^"|"$/g, ''),
          title: title.replace(/^"|"$/g, ''),
          url: ('https://' + url).replace(/^"|"$/g, ''),
        };

        if (isFirstItem) {
          isFirstItem = false;
          resolve(music);
        } else {
          if (musicSessions[channelId]) {
            musicSessions[channelId].queue?.push({
              ...music,
              id: randomUUID(),
              channelId,
              album: null,
              artist: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          } else {
            return;
          }
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
      '"%(title)s - %(webpage_url)s - thumbnail: %(thumbnail)s"',
      url,
    ]);
  }
}

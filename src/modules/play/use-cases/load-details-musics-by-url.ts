import { MusicDetails } from '@/domain/interfaces/music';
import { LoadDetailsMusicsByUrl } from '@/domain/use-cases/play/load-details-musics-by-url';
import { MusicSessionRepository } from '@/infra/music-session/music-session-repository';
import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import { AddMusicToSession } from '../controllers/add-music/add-music-protocols';

export class LoadDetailsMusicsByUrlUseCase implements LoadDetailsMusicsByUrl {
  constructor(
    private readonly musicSessionRepository: MusicSessionRepository,
    private readonly addMusicToSessionUseCase: AddMusicToSession,
  ) {}

  async load(url: string, channelId: string): Promise<MusicDetails> {
    return new Promise((resolve, reject) => {
      const musicDetails: MusicDetails[] = [];

      const { stdout, stderr } = this.spawn(url);
      stderr.on('data', (data) => {
        console.error('Erro na execução do yt-dlp:', data.toString());
        reject(new Error(data.toString()));
      });

      stdout.on('data', (data) => {
        const session = this.musicSessionRepository.load(channelId);
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

        if (session && !session.queue?.length) {
          this.addMusicToSessionUseCase.add(channelId, [music]);
          resolve(music);
        } else {
          if (session) {
            this.addMusicToSessionUseCase.add(channelId, [music]);
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

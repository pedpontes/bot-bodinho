import { MusicDetails, MusicModel } from '@/domain/interfaces/music';
import { LoadDetailsMusicsByUrl } from '@/domain/use-cases/play/load-details-musics-by-url';
import { addMusicToSessionObserver } from '@/main/observers/add-music';
import { VoiceBasedChannel } from 'discord.js';
import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { PlayMusic } from '../controllers/add-music/add-music-protocols';

export class LoadDetailsMusicsByUrlUseCase implements LoadDetailsMusicsByUrl {
  constructor(private readonly playMusicUseCase: PlayMusic) {}

  async load(
    url: string,
    voiceChannel: VoiceBasedChannel,
  ): Promise<MusicDetails[]> {
    const sessions = addMusicToSessionObserver();

    return new Promise((resolve, reject) => {
      const musicDetails: MusicDetails[] = [];
      const { stdout, stderr } = this.spawn(url);

      stderr.on('data', (data) => {
        console.error('Erro na execução do yt-dlp:', data.toString());
        reject(new Error(data.toString()));
      });

      stdout.on('data', async (data) => {
        const output = data.toString();

        const [title, url] = output
          .split(' - https://www.youtube.com/watch?v=')
          .map((item: string) => item.trim());

        const item: MusicModel = {
          id: randomUUID(),
          title: title || 'Música desconhecida',
          url: 'https://www.youtube.com/watch?v=' + url,
          album: null,
          artist: null,
          channelId: voiceChannel.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        if (
          !sessions[voiceChannel.id] ||
          !sessions[voiceChannel.id].queue ||
          !sessions[voiceChannel.id].queue?.length
        ) {
          sessions[voiceChannel.id] = {
            voiceChannel,
            queue: [item],
          };

          await this.playMusicUseCase.play(voiceChannel.id);
        } else {
          sessions[voiceChannel.id] = {
            voiceChannel,
            queue: [...(sessions[voiceChannel.id].queue || []), item],
          };
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

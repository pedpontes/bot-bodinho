import { MusicDetails } from '@/domain/interfaces/music';
import { LoadDetailsMusicsByUrl } from '@/domain/use-cases/play/load-details-musics-by-url';
import { YtProtocols } from '@/services/ytdl';
import { musicSessions } from '@/states/music-session';
import { randomUUID } from 'node:crypto';

export class LoadDetailsMusicsByUrlUseCase implements LoadDetailsMusicsByUrl {
  constructor(private readonly ytdlHelper: YtProtocols) {}

  async load(url: string, channelId: string): Promise<MusicDetails> {
    try {
      const data = await this.ytdlHelper.loadUrlDetails(url);

      if (!data.tracks || data.tracks.length === 0) {
        throw new Error('Nenhuma música encontrada na playlist.');
      }

      const [firstTrack, ...restTracks] = data.tracks;

      const music: MusicDetails = {
        thumbnail: firstTrack.thumbnail,
        title: firstTrack.title,
        url: firstTrack.url,
      };

      for (const track of restTracks) {
        if (musicSessions[channelId]) {
          musicSessions[channelId].queue?.push({
            ...track,
            id: randomUUID(),
            channelId,
            album: null,
            artist: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }

      return music;
    } catch (error) {
      console.error('Erro ao carregar detalhes das músicas:', error);
      throw error;
    }
  }
}

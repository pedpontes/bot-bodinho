import { MusicDetails } from '@/domain/interfaces/music';
import { MusicSessionRepository } from '@/infra/music-session/music-session-repository';
import { randomUUID } from 'crypto';
import { VoiceBasedChannel } from 'discord.js';
import {
  AddMusicToSession,
  MusicSession,
} from '../controllers/add-music/add-music-protocols';

export class AddMusicToSessionUseCase implements AddMusicToSession {
  constructor(
    private readonly musicSessionRepository: MusicSessionRepository,
  ) {}
  async add(
    id: VoiceBasedChannel['id'],
    musics: MusicDetails[],
  ): Promise<MusicSession> {
    const musicsFormatted = [];

    const { queue = [] } = this.musicSessionRepository.load(id)!;

    if (!this.musicSessionRepository.load(id)) {
      throw new Error(`Session with id ${id} does not exist.`);
    }

    musicsFormatted.push(
      ...musics.map((music) => {
        return {
          id: randomUUID(),
          title: music.title,
          url: music.url,
          artist: '',
          album: null,
          channelId: id,
          createdAt: new Date(),
          updatedAt: new Date(),
          thumbnail: music.thumbnail,
        };
      }),
    );

    this.musicSessionRepository.update(id, {
      queue: [...queue, ...musicsFormatted],
    });

    return this.musicSessionRepository.load(id)!;
  }
}

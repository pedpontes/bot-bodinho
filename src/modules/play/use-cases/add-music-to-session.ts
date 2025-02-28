import { VoiceBasedChannel } from 'discord.js';
import { randomUUID } from 'node:crypto';
import { AddMusicToSession } from '../../../domain/use-cases/play/add-music-to-session';
import { musicSessions } from '../../../states/music-session';
import { MusicDetails } from './load-details-musics-by-url';

export class AddMusicToSessionUseCase implements AddMusicToSession {
  constructor() {}
  async add(
    voiceChannel: VoiceBasedChannel,
    musics: MusicDetails[],
  ): Promise<boolean> {
    const session = musicSessions[voiceChannel.id];

    if (!session || !session.queue) {
      musicSessions[voiceChannel.id] = {
        queue: musics.map((music) => {
          return {
            id: randomUUID(),
            title: music.title,
            url: music.url,
            artist: '',
            album: null,
            channelId: voiceChannel.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }),
      };
      return true; // first music
    } else {
      session.queue.push(
        ...musics.map((music) => {
          return {
            id: randomUUID(),
            title: music.title,
            url: music.url,
            artist: '',
            album: null,
            channelId: voiceChannel.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }),
      );
    }
    return false; //queeued music
  }
}

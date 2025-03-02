import { MusicDetails } from '@/domain/interfaces/music';
import { musicSessions } from '@/states/music-session';
import { randomUUID } from 'crypto';
import { VoiceBasedChannel } from 'discord.js';
import { AddMusicToSession } from '../controllers/add-music/add-music-protocols';

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
            thumbnail: music.thumbnail,
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
            thumbnail: music.thumbnail,
          };
        }),
      );
    }
    return false; //queeued music
  }
}

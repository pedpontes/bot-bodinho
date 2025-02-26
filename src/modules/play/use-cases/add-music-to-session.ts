import { randomUUID } from 'node:crypto';
import { musicSessions } from '../../../states/music-session';
import { VoiceBasedChannel } from 'discord.js';
import { AddMusicToSession } from '../../../domain/use-cases/play/add-music-to-session';

export class AddMusicToSessionUseCase implements AddMusicToSession {
  constructor() {}
  async add(voiceChannel: VoiceBasedChannel, url: string): Promise<boolean> {
    const session = musicSessions[voiceChannel.id];

    if (!session) {
      musicSessions[voiceChannel.id] = {
        player: undefined,
        connection: undefined,
        queue: [
          {
            url,
            createdAt: new Date(),
            id: randomUUID(),
            updatedAt: new Date(),
            title: '',
            artist: '',
            album: null,
            channelId: voiceChannel.id,
          },
        ],
      };
      return true; // first music
    } else {
      session.queue?.push({
        url,
        createdAt: new Date(),
        id: randomUUID(),
        updatedAt: new Date(),
        title: '',
        artist: '',
        album: null,
        channelId: voiceChannel.id,
      });
    }
    return false; //queeued music
  }
}

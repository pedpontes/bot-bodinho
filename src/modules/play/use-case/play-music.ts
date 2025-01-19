import { spawn } from 'child_process';
import { MusicSession } from '../../../states/music-session';
import { createAudioResource } from '@discordjs/voice';
import { PlayMusic } from '../../../domain/use-cases/play/play-music';

export class PlayMusicUseCase implements PlayMusic {
  constructor() {}

  async play(session: MusicSession): Promise<void> {
    if (
      session!.queue?.length === 0 ||
      !session.queue ||
      !session.connection ||
      !session.player
    ) {
      session.connection?.destroy();
      return;
    }

    const { stdout } = spawn('python3', [
      '-m',
      'yt_dlp',
      '-q',
      '-x',
      '--audio-format',
      'mp3',
      '-o',
      '-',
      session.queue[0].url,
    ]);

    const resource = createAudioResource(stdout);
    session.player.play(resource);
    session.connection.subscribe(session.player);
  }
}

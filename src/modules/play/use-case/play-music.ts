import { spawn } from 'child_process';
import { MusicSession } from '../../../states/music-session';
import { createAudioResource } from '@discordjs/voice';
import { PlayMusic } from '../../../domain/use-cases/play/play-music';
import dev from '../../../config';

export class PlayMusicUseCase implements PlayMusic {
  private readonly dev: boolean = dev.ytDlpPath.split(' ').length > 1;
  constructor() {}

  async play(session: MusicSession): Promise<void> {
    const ytdlPath = dev.ytDlpPath.split(' ');
    if (
      session!.queue?.length === 0 ||
      !session.queue ||
      !session.connection ||
      !session.player
    ) {
      session.connection?.destroy();
      return;
    }

    const { stdout } = spawn('yt_dlp', [
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

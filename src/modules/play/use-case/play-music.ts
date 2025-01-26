import { spawn, exec, ChildProcessWithoutNullStreams } from 'child_process';
import { MusicSession } from '../../../states/music-session';
import { createAudioResource } from '@discordjs/voice';
import { PlayMusic } from '../../../domain/use-cases/play/play-music';
import dev from '../../../config';

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

    const { stdout, stderr } = this.spawn(session.queue[0].url);

    stderr.on('data', (data) => {
      console.log('Error:', data.toString());
    });

    console.log('Playing music', stdout);

    const resource = createAudioResource(stdout);
    session.player.play(resource);
    session.connection.subscribe(session.player);
  }

  private spawn(url: string): ChildProcessWithoutNullStreams {
    if(dev.ytl.email === '' || dev.ytl.pass === ''){
      console.log('[WARN] Email ou senha do YouTube não configurados');
    }

    return spawn('yt-dlp', [
      '-x',
      '-q',
      '-o',
      '-',
      url,
    ]);
  }
}

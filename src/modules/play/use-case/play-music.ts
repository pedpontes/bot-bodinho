import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { MusicSession } from '../../../states/music-session';
import { createAudioResource } from '@discordjs/voice';
import { PlayMusic } from '../../../domain/use-cases/play/play-music';
import dev from '../../../config';

export class PlayMusicUseCase implements PlayMusic {
  private readonly isDev: boolean;
  constructor() {
    this.isDev = dev.ytDlpPath.split(' ').length > 1;
  }

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

    if(!this.isDev){
      return spawn('yt-dlp', [
        '--username',
        dev.ytl.email || '',
        '--password',
        dev.ytl.pass || '',
        '-f',
        '139',
        '--cookies',
        'cookies.txt',
        '-q',
        '-o',
        '-',
        url,
      ], { cwd: '~/bot-bodinho/' });
    }
    else {
      return spawn('python3', [
        '-m',
        'yt_dlp',
        '--username',
        dev.ytl.email || '',
        '--password',
        dev.ytl.pass || '',
        '-f',
        '139',
        '--cookies',
        'cookies.txt',
        '-q',
        '-o',
        '-',
        url,
      ], { cwd: '~/bot-bodinho/' });
    }
  }
}

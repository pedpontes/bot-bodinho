import { MusicSession } from '@/states/music-session';
import { createAudioResource, StreamType } from '@discordjs/voice';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { PlayMusic } from '../controllers/add-music/add-music-protocols';

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
      console.log(data.toString());
    });

    const resource = createAudioResource(stdout, {
      inputType: StreamType.Arbitrary,
      inlineVolume: true,
      metadata: 'Música tocando',
    });
    session.player.play(resource);
    session.connection.subscribe(session.player);
  }

  private spawn(url: string): ChildProcessWithoutNullStreams {
    return spawn('yt-dlp', ['-x', '-q', '-o', '-', url]);
  }
}

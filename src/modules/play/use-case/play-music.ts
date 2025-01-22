import { spawn } from 'child_process';
import { MusicSession } from '../../../states/music-session';
import { createAudioResource } from '@discordjs/voice';
import { PlayMusic } from '../../../domain/use-cases/play/play-music';
import dev from '../../../config';

export class PlayMusicUseCase implements PlayMusic {
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

    const commands = [...ytdlPath, '-q', '-x', '--audio-format', 'mp3', '-o', '-'].filter((x) => x !== '' || x).shift(); 

    if(!commands) throw new Error('Invalid yt-dlp path');

    console.log('Commands:', commands);

    const { stdout, stderr } = spawn(ytdlPath[0], [
      ...commands,
      session.queue[0].url,
    ]);

    stderr.on('data', (data) => {
      console.log('Error:', data.toString());
    });

    console.log('Playing music', stdout);

    const resource = createAudioResource(stdout);
    session.player.play(resource);
    session.connection.subscribe(session.player);
  }
}

import { YTProtocols } from '@/services/ytdl';
import { MusicSession } from '@/states/music-session';
import { createAudioResource, StreamType } from '@discordjs/voice';
import { PlayMusic } from '../controllers/add-music/add-music-protocols';

export class PlayMusicUseCase implements PlayMusic {
  constructor(private readonly YTHelper: YTProtocols) {}

  async play(session: MusicSession): Promise<void> {
    if (!session.queue?.length || !session.connection || !session.player) {
      session.connection?.destroy();
      return;
    }

    const [{ url }] = session.queue;

    const { stdout, stderr } = this.YTHelper.loadMusic(url);

    stderr.on('data', (data) => {
      console.error(`[ERROR] [PLAY_MUSIC] ${data}`);
      throw new Error(`[ERROR] [PLAY_MUSIC] ${data}`);
    });

    const resource = createAudioResource(stdout, {
      inputType: StreamType.Arbitrary,
      inlineVolume: true,
      metadata: 'Música tocando',
    });
    session.player.play(resource);
    session.connection.subscribe(session.player);
  }
}

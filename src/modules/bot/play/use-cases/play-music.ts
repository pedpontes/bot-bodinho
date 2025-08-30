import { MusicSessionRepository } from '@/infra/music-session/music-session-repository';
import { YTProtocols } from '@/services/ytdl';
import { createAudioResource, StreamType } from '@discordjs/voice';
import { VoiceBasedChannel } from 'discord.js';
import { PassThrough } from 'stream';
import { PlayMusic } from '../controllers/add-music/add-music-protocols';

export class PlayMusicUseCase implements PlayMusic {
  constructor(
    private readonly YTHelper: YTProtocols,
    private readonly musicSessionRepository: MusicSessionRepository,
  ) {}

  async play(id: VoiceBasedChannel['id']): Promise<void> {
    const session = this.musicSessionRepository.load(id);

    if (!session) {
      console.error(`[PLAY_MUSIC] Session not found for ID: ${id}`);
      return;
    }

    if (!session.queue?.length || !session.connection || !session.player) {
      session.connection?.destroy();
      return;
    }

    const [{ url }] = session.queue;

    if (session.proc) {
      session.proc.kill('SIGKILL');
      session.proc = null;
    }

    const proc = this.YTHelper.loadMusic(url);

    this.musicSessionRepository.update(id, {
      proc,
    });

    const { stderr, stdout } = proc;

    const pass = new PassThrough({ highWaterMark: 1 << 25 });
    stdout.pipe(pass);

    stderr.on('data', (data) => {
      this.musicSessionRepository.update(id, {
        proc: null,
      });
      console.error(`[ERROR] [PLAY_MUSIC] ${data}`);
    });

    const resource = createAudioResource(pass, {
      inputType: StreamType.Arbitrary,
      inlineVolume: true,
      metadata: 'Música tocando',
    });
    session.player.play(resource);
    session.connection.subscribe(session.player);
  }
}

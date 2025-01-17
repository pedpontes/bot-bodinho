import { spawn } from 'child_process';
import { MusicSession } from '../states/music-session';
import { createAudioResource } from '@discordjs/voice';

export async function playMusic(session: MusicSession) {
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

import { MusicSession } from '../../../states/music-session';

export interface PlayMusic {
  play(session: MusicSession): Promise<void>;
}

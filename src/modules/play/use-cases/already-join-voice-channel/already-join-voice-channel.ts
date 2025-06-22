import { MusicSessionRepository } from '@/infra/music-session/music-session-repository';
import { VoiceBasedChannel } from 'discord.js';

export class AleradyJoinVoiceChannelUseCase {
  constructor(
    private readonly musicSessionRepository: MusicSessionRepository,
  ) {}

  async check(id: VoiceBasedChannel['id']) {
    const session = this.musicSessionRepository.load(id);

    if (!session || !session.player || !session.connection) return false;

    return true;
  }
}

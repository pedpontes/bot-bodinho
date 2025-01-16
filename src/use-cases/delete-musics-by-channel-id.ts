import { MusicRepository } from '../infra/music-repository';

export default function deleteMusicsByIdChannelId(channelId: string) {
  const musicRepository = new MusicRepository();

  return musicRepository.deleteAllByChannelId(channelId);
}

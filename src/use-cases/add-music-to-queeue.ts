import { ChannelRepository } from '../infra/channel-repository';
import { MusicRepository } from '../infra/music-repository';

export default async function addMusicToQueue(channelId: string, url: string) {
  const channelRepository = new ChannelRepository();

  const channel = await channelRepository.loadByChannelId(channelId);

  if (!channel) {
    await channelRepository.create(channelId);
  }

  const musicRepository = new MusicRepository();

  await musicRepository.create(channelId, url);
}

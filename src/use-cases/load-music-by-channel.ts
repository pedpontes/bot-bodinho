import { ChannelRepository } from '../infra/channel-repository';

export default async function loadMusicByChannelId(channelId: string) {
  const channelRepository = new ChannelRepository();

  return await channelRepository.loadByChannelId(channelId);
}

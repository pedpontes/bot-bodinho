import { MusicRepository } from '../infra/music-repository';

export default async function deleteMusicById(id: string) {
  const musicRepository = new MusicRepository();

  return await musicRepository.deleteById(id);
}

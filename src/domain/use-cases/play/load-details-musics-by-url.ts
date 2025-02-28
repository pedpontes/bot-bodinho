import { MusicDetails } from '@/domain/interfaces/music';

export interface LoadDetailsMusicsByUrl {
  load(url: string): Promise<MusicDetails[]>;
}

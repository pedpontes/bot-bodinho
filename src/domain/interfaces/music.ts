export interface MusicModel {
  id: string;
  name: string;
  artist: string | null;
  url: string;
  imageUrl: string | null;
  playlistId: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export type AddMusicModel = Omit<MusicModel, 'id' | 'createdAt' | 'updatedAt'>;

export interface MusicModel {
  url: string;
  createdAt: Date;
  id: string;
  updatedAt: Date;
  title: string | null;
  artist: string | null;
  album: string | null;
  channelId: string;
}

export type MusicDetails = {
  url: string;
  title: string;
};

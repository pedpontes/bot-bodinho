export interface MusicModel {
  id: string;
  title?: string;
  artist?: string;
  album?: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  chanelId?: string;
}

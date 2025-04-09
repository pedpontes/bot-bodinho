export interface PlayListModel {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type AddPlayListModel = Omit<
  PlayListModel,
  'id' | 'createdAt' | 'updatedAt'
>;

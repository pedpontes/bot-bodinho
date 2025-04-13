import { AddPlayListModel, PlayListModel } from '@/domain/interfaces/playlist';

export interface PlayListRepository {
  add: (data: AddPlayListModel) => Promise<PlayListModel>;
}

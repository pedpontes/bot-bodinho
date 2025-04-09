import { PlayListRepository } from '@/domain/infra/playlist/playlist';
import { AddPlayListModel, PlayListModel } from '@/domain/interfaces/playlist';
import prismaHelper from '@/services/prisma';

export class PlayListPrismaRepository implements PlayListRepository {
  constructor() {}

  async add(data: AddPlayListModel): Promise<PlayListModel> {
    return await prismaHelper.playlist.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });
  }
}

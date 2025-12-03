import {
  AddUploadModel,
  UploadModel,
  UploadPaginationRequest,
  UploadPaginationResponse,
} from '@/domain/interfaces/upload';
import { db } from '@/main/prisma';
import { Prisma } from '@prisma/client';

export interface UploadRepository {
  add(data: AddUploadModel): Promise<UploadModel>;
  delete(id: UploadModel['id']): Promise<void>;
  loadById(id: UploadModel['id']): Promise<UploadModel | null>;
  loadPagination(
    data: UploadPaginationRequest,
  ): Promise<UploadPaginationResponse>;
}

export class UploadPrismaRepository implements UploadRepository {
  constructor() {}

  async add(data: AddUploadModel): Promise<UploadModel> {
    return await db.upload.create({
      data,
    });
  }

  async delete(id: UploadModel['id']): Promise<void> {
    await db.upload.delete({
      where: {
        id,
      },
    });
  }

  async loadById(id: UploadModel['id']): Promise<UploadModel | null> {
    return await db.upload.findUnique({
      where: { id },
    });
  }

  async loadPagination(
    data: UploadPaginationRequest,
  ): Promise<UploadPaginationResponse> {
    const { userId } = data.filters || {};
    const { limit, page, search } = data;

    const where = {
      userId: userId || undefined,
      filename: {
        contains: search || undefined,
        mode: Prisma.QueryMode.insensitive,
      },
    };

    const uploads = await db.upload.findMany({
      where,
      orderBy: data.orderBy || {
        updatedAt: 'desc',
      },
      take: limit,
      skip: page && limit ? (page - 1) * limit : undefined,
    });

    const total = await db.upload.count({
      where,
    });

    return {
      data: uploads,
      page: page || 1,
      limit: limit || total,
      count: {
        total: total,
      },
    };
  }
}

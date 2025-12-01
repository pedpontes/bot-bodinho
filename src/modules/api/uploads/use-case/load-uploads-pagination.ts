import {
  UploadPaginationRequest,
  UploadPaginationResponse,
} from '@/domain/interfaces/upload';
import { UserModel, UserRoleEnum } from '@/domain/interfaces/user';
import { UploadRepository } from '@/infra/prisma/upload/upload-prisma-repository';

export interface LoadUploadsPagination {
  loadAll(
    data: UploadPaginationRequest,
    user: UserModel,
  ): Promise<UploadPaginationResponse>;
}

export class LoadUploadsPaginationUseCase implements LoadUploadsPagination {
  constructor(private readonly uploadRepository: UploadRepository) {}

  async loadAll(
    data: UploadPaginationRequest,
    user: UserModel,
  ): Promise<UploadPaginationResponse> {
    let filters = data.filters || {};

    if (user.role != UserRoleEnum.ADMIN) {
      filters = {
        ...filters,
        userId: user.id,
      };
    }

    const uploads = await this.uploadRepository.loadPagination({
      ...data,
      filters,
    });

    return uploads;
  }
}

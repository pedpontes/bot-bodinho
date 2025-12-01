import { UploadPrismaRepository } from '@/infra/prisma/upload/upload-prisma-repository';
import { LoadUploadsPaginationController } from '@/modules/api/uploads/controller/load-uploads-pagination';
import { LoadUploadsPaginationUseCase } from '@/modules/api/uploads/use-case/load-uploads-pagination';

export const makeLoadUploadsPaginationController =
  (): LoadUploadsPaginationController => {
    return new LoadUploadsPaginationController(
      new LoadUploadsPaginationUseCase(new UploadPrismaRepository()),
    );
  };

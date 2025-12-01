import { UploadPrismaRepository } from '@/infra/prisma/upload/upload-prisma-repository';
import { AddUploadController } from '@/modules/api/uploads/controller/add-upload';
import { AddUploadUseCase } from '@/modules/api/uploads/use-case/add-upload';

export const makeAddUploadController = (): AddUploadController => {
  return new AddUploadController(
    new AddUploadUseCase(new UploadPrismaRepository()),
  );
};

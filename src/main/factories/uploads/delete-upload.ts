import { UploadPrismaRepository } from '@/infra/prisma/upload/upload-prisma-repository';
import { DeleteUploadController } from '@/modules/api/uploads/controller/delete-upload';
import { DeleteUploadUseCase } from '@/modules/api/uploads/use-case/delete-upload';

export const makeDeleteUploadController = (): DeleteUploadController => {
  return new DeleteUploadController(
    new DeleteUploadUseCase(new UploadPrismaRepository()),
  );
};

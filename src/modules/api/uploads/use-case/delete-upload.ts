import { UploadModel } from '@/domain/interfaces/upload';
import { UserModel } from '@/domain/interfaces/user';
import { UploadRepository } from '@/infra/prisma/upload/upload-prisma-repository';
import { FileManager } from '@/utils/file-manager/file-manager';

export interface DeleteUpload {
  delete(id: UploadModel['id'], user: UserModel): Promise<void>;
}

export class DeleteUploadUseCase implements DeleteUpload {
  constructor(private readonly uploadRepository: UploadRepository) {}

  async delete(id: UploadModel['id'], user: UserModel): Promise<void> {
    const upload = await this.uploadRepository.loadById(id);

    if (!upload) throw new Error('(deleteUploadUseCase) Upload not found');

    const canDelete = upload.userId === user.id;

    if (!canDelete)
      throw new Error('(deleteUploadUseCase) User not authorized');

    await FileManager.delete(upload.path);
    await this.uploadRepository.delete(id);
  }
}

import { UploadModel } from '@/domain/interfaces/upload';
import { UserModel } from '@/domain/interfaces/user';
import { UploadPrismaRepository } from '@/infra/prisma/upload/upload-prisma-repository';
import { FileAdapterModel } from '@/presentation/protocols';
import { FileManager } from '@/utils/file-manager/file-manager';

export interface AddUpload {
  add(file: FileAdapterModel, user: UserModel): Promise<UploadModel>;
}

export class AddUploadUseCase implements AddUpload {
  constructor(
    private readonly uploadPrismaRepository: UploadPrismaRepository,
  ) {}

  async add(file: FileAdapterModel, user: UserModel): Promise<UploadModel> {
    const { path, filename, mimetype, size } = await FileManager.moveToPath(
      file,
      'uploads',
      user.id,
    );

    const upload = await this.uploadPrismaRepository.add({
      filename: filename,
      mimetype: mimetype,
      path: path,
      size: size,
      userId: user.id,
    });

    return upload;
  }
}

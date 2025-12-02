import { UploadModel } from '@/domain/interfaces/upload';
import { UserWithDiscordAuthModel } from '@/domain/interfaces/user';
import { UploadRepository } from '@/infra/prisma/upload/upload-prisma-repository';
import { UserRepository } from '@/infra/prisma/user-repository';

export interface PlayUpload {
  execute(
    uploadId: string,
    userId: string,
  ): Promise<{
    upload: UploadModel;
    user: UserWithDiscordAuthModel;
  }>;
}

export class PlayUploadUseCase implements PlayUpload {
  constructor(
    private readonly uploadRepository: UploadRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(uploadId: string, userId: string) {
    const upload = await this.uploadRepository.loadById(uploadId);

    if (!upload || upload.userId !== userId) {
      throw new Error('Upload não encontrado');
    }

    const user = await this.userRepository.loadByIdWithDiscordAuth(userId);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return { upload, user };
  }
}

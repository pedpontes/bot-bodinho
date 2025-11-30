import { UpdateUserModel, UserModel } from '@/domain/interfaces/user';
import { UserRepository } from '@/infra/prisma/user-repository';

export interface UpdateUser {
  update(id: UserModel['id'], data: UpdateUserModel): Promise<UserModel | null>;
}

export class UpdateUserUseCase implements UpdateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async update(
    id: UserModel['id'],
    data: UpdateUserModel,
  ): Promise<UserModel | null> {
    const existingUser = await this.userRepository.loadById(id);

    if (!existingUser) return null;

    const updatedUser = await this.userRepository.update(id, data);
    return updatedUser;
  }
}

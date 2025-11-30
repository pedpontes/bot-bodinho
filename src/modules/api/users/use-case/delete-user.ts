import { UserRepository } from '@/infra/prisma/user-repository';

export interface DeleteUser {
  delete(id: string): Promise<void>;
}

export class DeleteUserUseCase implements DeleteUser {
  constructor(private readonly userRepository: UserRepository) {}

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}

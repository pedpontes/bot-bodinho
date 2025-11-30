import { UserModel } from '@/domain/interfaces/user';
import { UserRepository } from '@/infra/prisma/user-repository';

export interface LoadUsers {
  loadAll: () => Promise<UserModel[]>;
  load: (id: string) => Promise<UserModel | null>;
}

export class LoadUsersUseCase implements LoadUsers {
  constructor(private readonly userRepository: UserRepository) {}

  async loadAll(): Promise<UserModel[]> {
    const allUsers = await this.userRepository.loadAll();
    return allUsers;
  }

  async load(id: string): Promise<UserModel | null> {
    const user = await this.userRepository.loadById(id);
    if (!user) return null;

    return user;
  }
}

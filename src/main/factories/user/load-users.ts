import { UserPrismaRepository } from '@/infra/prisma/user-repository';
import { LoadUsersController } from '@/modules/api/users/controller/load-users';
import { LoadUsersUseCase } from '@/modules/api/users/use-case/load-users';

export const makeLoadUsers = (): LoadUsersController => {
  const userRepository = new UserPrismaRepository();

  return new LoadUsersController(new LoadUsersUseCase(userRepository));
};

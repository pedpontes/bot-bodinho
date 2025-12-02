import { UserPrismaRepository } from '@/infra/prisma/user-repository';
import { UpdateUserController } from '@/modules/api/users/controller/update-user';
import { UpdateUserUseCase } from '@/modules/api/users/use-case/update-user';

export const makeUpdateUser = (): UpdateUserController => {
  const userRepository = new UserPrismaRepository();

  return new UpdateUserController(new UpdateUserUseCase(userRepository));
};

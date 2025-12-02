import { UserPrismaRepository } from '@/infra/prisma/user-repository';
import { DeleteUserController } from '@/modules/api/users/controller/delete-user';
import { DeleteUserUseCase } from '@/modules/api/users/use-case/delete-user';

export const makeDeleteUser = (): DeleteUserController => {
  const userRepository = new UserPrismaRepository();

  return new DeleteUserController(new DeleteUserUseCase(userRepository));
};

import { PrismaUserRepository } from '@/infra/prisma/user-repository';
import { CreateUserController } from '@/modules/api/users/controller/add-user';
import { AddUserUseCase } from '@/modules/api/users/use-case/add-user';

export const makeCreateUser = (): CreateUserController => {
  const userRepository = new PrismaUserRepository();

  return new CreateUserController(new AddUserUseCase(userRepository));
};

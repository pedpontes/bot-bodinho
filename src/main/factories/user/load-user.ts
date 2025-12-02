import { UserPrismaRepository } from '@/infra/prisma/user-repository';
import { LoadUserController } from '@/modules/api/auth/controllers/load-user/load-user';

export const makeLoadUser = (): LoadUserController => {
  return new LoadUserController(new UserPrismaRepository());
};

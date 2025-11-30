import { adaptRoute } from '@/main/adapters/express-router-adapter';
import { makeDeleteUser } from '@/main/factories/user/delete-user';
import { makeLoadUsers } from '@/main/factories/user/load-users';
import { makeUpdateUser } from '@/main/factories/user/update-user';
import { Router } from 'express';

const usersRouter = Router();

usersRouter.get(['/', '/:id'], adaptRoute(makeLoadUsers()));
usersRouter.put('/:id', adaptRoute(makeUpdateUser()));
usersRouter.delete('/:id', adaptRoute(makeDeleteUser()));

export { usersRouter };

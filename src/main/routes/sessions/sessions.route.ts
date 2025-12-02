import { adaptRoute } from '@/main/adapters/express-router-adapter';
import { makeLoadSessions } from '@/main/factories/session/load-sessions';
import { ensureAuthenticateUser } from '@/main/middlewares/ensureAuthenticateUser';
import { Router } from 'express';

const sessionsRouter = Router();

sessionsRouter.get(
  ['/', '/:id'],
  ensureAuthenticateUser,
  adaptRoute(makeLoadSessions()),
);

export { sessionsRouter };

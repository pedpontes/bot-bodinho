import { adaptRoute } from '@/main/adapters/express-router-adapter';
import { makeLoadCurrentQueue } from '@/main/factories/session/load-current-queue';
import { makeLoadSessions } from '@/main/factories/session/load-sessions';
import { ensureAuthenticateUser } from '@/main/middlewares/ensureAuthenticateUser';
import { Router } from 'express';

const sessionsRouter = Router();

sessionsRouter.get(
  '/queue',
  ensureAuthenticateUser,
  adaptRoute(makeLoadCurrentQueue()),
);

sessionsRouter.get(
  ['/', '/:id'],
  ensureAuthenticateUser,
  adaptRoute(makeLoadSessions()),
);

export { sessionsRouter };

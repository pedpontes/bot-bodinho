import { adaptRoute } from '@/main/adapters/express-router-adapter';
import { makeLoadSessions } from '@/main/factories/session/load-sessions';
import { Router } from 'express';

const sessionsRouter = Router();

sessionsRouter.get(['/', '/:id'], adaptRoute(makeLoadSessions()));

export { sessionsRouter };

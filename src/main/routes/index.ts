import { Router } from 'express';
import { oauthRouter } from './oauth/oauth.routes';
import { sessionsRouter } from './sessions/sessions.route';
import { usersRouter } from './users/users.routes';

const router = Router();

router.use('/sessions', sessionsRouter);
router.use('/oauth', oauthRouter);
router.use('/users', usersRouter);

export { router };

import { Router } from 'express';
import { oauthRouter } from './oauth/oauth.routes';
import { sessionsRouter } from './sessions/sessions.route';

const router = Router();

router.use('/sessions', sessionsRouter);
router.use('/oauth', oauthRouter);

export { router };

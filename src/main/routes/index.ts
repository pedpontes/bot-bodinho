import { Router } from 'express';
import { authRouter } from './auth/auth.routes';
import { oauthRouter } from './oauth/oauth.routes';
import { sessionsRouter } from './sessions/sessions.route';
import { uploadsRouter } from './uploads/uploads.routes';
import { usersRouter } from './users/users.routes';

const router = Router();

router.use('/sessions', sessionsRouter);
router.use('/oauth', oauthRouter);
router.use('/users', usersRouter);
router.use('/uploads', uploadsRouter);
router.use('/auth', authRouter);

export { router };

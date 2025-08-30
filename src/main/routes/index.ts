import { Router } from 'express';
import { sessionsRouter } from './sessions/sessions.route';

const router = Router();

router.use('/sessions', sessionsRouter);

export { router };

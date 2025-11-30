import { adaptRoute } from '@/main/adapters/express-router-adapter';
import { Router } from 'express';

const webhookRouter = Router();

webhookRouter.get('/discord/auth', adaptRoute(makeSuccessAuthCallback));

export { webhookRouter };

import { adaptRoute } from '@/main/adapters/express-router-adapter';
import { makeDiscordAuthCallback } from '@/main/factories/webhooks/discord/auth-callback';
import { Router } from 'express';

const webhookRouter = Router();

webhookRouter.get('/discord/auth', adaptRoute(makeDiscordAuthCallback()));

export { webhookRouter };

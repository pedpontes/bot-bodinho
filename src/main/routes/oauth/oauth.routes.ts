import { adaptRoute } from '@/main/adapters/express-router-adapter';
import { makeAuthDiscord } from '@/main/factories/auth-discord/auth-discord';
import { Router } from 'express';

const oauthRouter = Router();

oauthRouter.get('/discord', adaptRoute(makeAuthDiscord()));

export { oauthRouter };

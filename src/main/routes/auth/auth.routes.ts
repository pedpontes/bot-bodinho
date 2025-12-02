import { adaptRoute } from '@/main/adapters/express-router-adapter';
import { makeLoadUser } from '@/main/factories/user/load-user';
import { ensureAuthenticateUser } from '@/main/middlewares/ensureAuthenticateUser';
import { Router } from 'express';

const authRouter = Router();

authRouter.get('/me', ensureAuthenticateUser, adaptRoute(makeLoadUser()));

authRouter.get('/logout', (_, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  return res.status(200).json({ message: 'Logout realizado com sucesso' });
});

export { authRouter };

import { JWTHelper } from '@/services/jwt';
import { NextFunction, Request, Response } from 'express';

export async function ensureAuthenticateUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: 'Token missing' });
    return;
  }

  const jwtHelper = new JWTHelper();

  try {
    const payload = await jwtHelper.verifyToken(token);
    req.user = payload;
  } catch {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }

  next();
}

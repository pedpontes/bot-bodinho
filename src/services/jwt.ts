import { JWTPayloadModel } from '@/domain/interfaces/jwt';
import { env } from '@/main/configs/config';
import jwt from 'jsonwebtoken';

export interface JWTHelperProtocols {
  generateToken(payload: JWTPayloadModel, expiresIn: string): Promise<string>;
}

export class JWTHelper implements JWTHelperProtocols {
  constructor() {}

  async generateToken(
    payload: JWTPayloadModel,
    expiresIn: string,
  ): Promise<string> {
    if (!env.jwt?.secret) throw new Error('JWT secret is not configured.');

    const token = jwt.sign(payload, env.jwt.secret, {
      expiresIn,
    });

    return token;
  }
}

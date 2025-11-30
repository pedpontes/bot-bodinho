import { JWTPayloadModel } from '@/domain/interfaces/jwt';
import { env } from '@/main/configs/config';
import * as jwt from 'jsonwebtoken';

export interface JWTHelperProtocols {
  generateToken(payload: JWTPayloadModel, expiresIn: string): Promise<string>;
}

export class JWTHelper implements JWTHelperProtocols {
  constructor() {
    if (!env.jwt.secret)
      throw new Error('(JWTHelper) JWT secret is not configured.');
  }

  async generateToken(
    payload: JWTPayloadModel,
    expiresIn: string,
  ): Promise<string> {
    const token = jwt.sign(payload, env.jwt.secret, {
      expiresIn,
    });

    return token;
  }

  async verifyToken(token: string): Promise<JWTPayloadModel> {
    const decoded = jwt.verify(token, env.jwt.secret);
    return decoded as JWTPayloadModel;
  }
}

export class JWTHelper implements JTWHelperProtocols {
  constructor() {}

  async generateToken(
    payload: JWTPayloadModel,
    expiresIn: string,
  ): Promise<string> {
    return '';
  }
}

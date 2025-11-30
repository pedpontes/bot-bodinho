declare namespace Express {
  export interface Request {
    user?: import('@/domain/interfaces/jwt').JWTPayloadModel;
  }
}

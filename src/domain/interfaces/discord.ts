export type UserInfoDiscordModel = {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
};

export type TokenResponseModel = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  refresh_token?: string;
};

export type DiscordAuthModel = {
  id: string;
  discordId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  scope: string;
  tokenType: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AddDiscordAuthModel = Omit<
  DiscordAuthModel,
  'id' | 'createdAt' | 'updatedAt'
>;

export type UpdateDiscordAuthModel = Partial<AddDiscordAuthModel>;

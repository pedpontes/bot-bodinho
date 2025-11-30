export type UserInfoDiscordModel = {
  id: string;
  username: string;
  email: string | null;
  avatar: string | null;
};

export type TokenResponseModel = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  refresh_token?: string;
};

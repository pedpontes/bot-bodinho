import { DiscordAuthModel } from './discord';

export type UserModel = {
  id: string;
  username: string | null;
  email: string;
  avatar: string | null;
  discordAuthId: DiscordAuthModel['id'];
  createdAt: Date;
  updatedAt: Date;
};

export type AddUserModel = Omit<
  UserModel,
  'id' | 'createdAt' | 'updatedAt' | 'discordAuthId'
>;

export type UpdateUserModel = Partial<AddUserModel>;

export type UserWithDiscordAuthModel = UserModel & {
  discordAuth: DiscordAuthModel;
};

export type UserProviders = 'platform' | 'discord';

export enum UserProvidersEnum {
  PLATFORM = 'platform',
  DISCORD = 'discord',
}

export type UserModel = {
  id: string;
  discordId: string | null;
  username: string | null;
  email: string | null;
  avatar: string | null;
  provider: UserProviders;
  createdAt: Date;
  updatedAt: Date;
};

export type AddUserModel = Omit<UserModel, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateUserModel = Partial<AddUserModel>;

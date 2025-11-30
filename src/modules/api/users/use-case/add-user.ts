import {
  AddUserModel,
  UserModel,
  UserProviders,
  UserProvidersEnum,
} from '@/domain/interfaces/user';
import { UserRepository } from '@/infra/prisma/user-repository';

export type AddUserParams = {
  discordId: string;
  username: string;
  email: string | null;
  avatar: string | null;
  provider: UserProviders;
};

export interface AddUser {
  add(params: AddUserParams): Promise<UserModel>;
}

export class AddUserUseCase implements AddUser {
  constructor(private readonly userRepository: UserRepository) {}

  async add(params: AddUserParams): Promise<UserModel> {
    const existingUser = await this.userRepository.loadByDiscordId(
      params.discordId,
    );

    if (existingUser) return existingUser;

    const user: AddUserModel = {
      discordId: params.discordId,
      username: params.username,
      email: params.email ?? null,
      avatar: params.avatar ?? null,
      provider: UserProvidersEnum.DISCORD,
    };

    const createdUser = await this.userRepository.add(user);

    return createdUser;
  }
}

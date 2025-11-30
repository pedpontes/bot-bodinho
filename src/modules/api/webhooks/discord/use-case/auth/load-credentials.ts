import {
  AddUserModel,
  UserModel,
  UserProvidersEnum,
} from '@/domain/interfaces/user';
import { UserRepository } from '@/infra/prisma/user-repository';
import { DiscordHelper } from '@/services/discord';
import { JWTHelperProtocols } from '@/services/jwt';

export type LoadCredentialsDiscordResult = {
  user: UserModel;
  accessToken: string;
};

export interface LoadCredentialsDiscord {
  load(code: string): Promise<LoadCredentialsDiscordResult>;
}

export class LoadCredentialsDiscordUseCase implements LoadCredentialsDiscord {
  constructor(
    private readonly discordHelper: DiscordHelper,
    private readonly userRepository: UserRepository,
    private readonly jwtHelper: JWTHelperProtocols,
  ) {}

  async load(code: string): Promise<LoadCredentialsDiscordResult> {
    if (!code) {
      throw new Error(
        '(loadCredentialsUseCase) Código de autorização do Discord é obrigatório.',
      );
    }

    const token = await this.discordHelper.generateToken(code);

    const userInfo = await this.discordHelper.loadUserInfo({
      token: token.access_token,
      tokenType: token.token_type,
    });

    let user = await this.userRepository.loadByDiscordId(userInfo.id);

    if (!user) {
      const newUser: AddUserModel = {
        discordId: userInfo.id,
        username: userInfo.username,
        email: userInfo.email,
        avatar: userInfo.avatar,
        provider: UserProvidersEnum.DISCORD,
      };

      user = await this.userRepository.add(newUser);
    } else {
      user = await this.userRepository.update(user.id, {
        username: userInfo.username ?? user.username,
        email: userInfo.email ?? user.email,
        avatar: userInfo.avatar ?? user.avatar,
      });
    }

    const payload = {
      sub: user.id,
      discordId: user.discordId,
    };

    const accessToken = await this.jwtHelper.generateToken(payload, '1d');

    return {
      user,
      accessToken,
    };
  }
}

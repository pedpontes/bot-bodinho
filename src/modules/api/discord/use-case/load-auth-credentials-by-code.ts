import { AddUserModel, UserModel } from '@/domain/interfaces/user';
import { DiscordAuthRepository } from '@/infra/prisma/discord-auth/discord-auth-prisma-repository';
import { UserRepository } from '@/infra/prisma/user-repository';
import { DiscordHelper } from '@/services/discord';
import { JWTHelperProtocols } from '@/services/jwt';

export type LoadAuthCredentialsByCodeDiscordResult = {
  user: UserModel;
  accessToken: string;
};

export interface LoadAuthCredentialsByCodeDiscord {
  load(code: string): Promise<LoadAuthCredentialsByCodeDiscordResult>;
}

export class LoadAuthCredentialsDiscordUseCase
  implements LoadAuthCredentialsByCodeDiscord
{
  constructor(
    private readonly discordHelper: DiscordHelper,
    private readonly userRepository: UserRepository,
    private readonly jwtHelper: JWTHelperProtocols,
    private readonly discordAuthRepository: DiscordAuthRepository,
  ) {}

  async load(code: string): Promise<LoadAuthCredentialsByCodeDiscordResult> {
    if (!code) {
      throw new Error(
        '(loadCredentialsUseCase) Código de autorização do Discord é obrigatório.',
      );
    }

    const token = await this.discordHelper.generateTokenByCode(code);

    const userInfo = await this.discordHelper.loadUserInfo({
      token: token.access_token,
      tokenType: token.token_type,
    });

    let user = await this.userRepository.loadByDiscordId(userInfo.id);

    if (!user) {
      const newUser: AddUserModel = {
        username: userInfo.username,
        email: userInfo.email,
        avatar: userInfo.avatar,
        role: 'user',
      };

      user = await this.userRepository.add(newUser, {
        accessToken: token.access_token,
        discordId: userInfo.id,
        expiresAt: token.expires_in,
        refreshToken: token.refresh_token ?? '',
        scope: token.scope,
        tokenType: token.token_type,
      });
    } else {
      await this.discordAuthRepository.update(user.discordAuthId, {
        accessToken: token.access_token,
        expiresAt: token.expires_in,
        refreshToken: token.refresh_token ?? '',
        scope: token.scope,
        tokenType: token.token_type,
      });
    }

    const payload = user;

    const accessToken = await this.jwtHelper.generateToken(payload, '1d');

    return {
      user,
      accessToken,
    };
  }
}

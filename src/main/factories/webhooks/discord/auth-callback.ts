import { DiscordAuthCallbackController } from '@/modules/api/webhooks/discord/controller/auth-callback';
import { LoadCredentialsDiscordUseCase } from '@/modules/api/webhooks/discord/use-case/auth/load-credentials';
import { PrismaUserRepository } from '@/infra/prisma/user-repository';
import { DiscordHelper } from '@/services/discord';
import { JWTHelper } from '@/services/jwt';

export const makeDiscordAuthCallback =
  (): DiscordAuthCallbackController => {
    const userRepository = new PrismaUserRepository();
    const discordHelper = new DiscordHelper();
    const loadCredentialsDiscordUseCase =
      new LoadCredentialsDiscordUseCase(
        discordHelper,
        userRepository,
        new JWTHelper(),
      );

    return new DiscordAuthCallbackController(loadCredentialsDiscordUseCase);
  };

import { DiscordAuthPrismaRepository } from '@/infra/prisma/discord-auth/discord-auth-prisma-repository';
import { PrismaUserRepository } from '@/infra/prisma/user-repository';
import { DiscordAuthCallbackController } from '@/modules/api/discord/controllers/auth-discord-callback';
import { LoadAuthCredentialsDiscordUseCase } from '@/modules/api/discord/use-case/load-auth-credentials-by-code';
import { DiscordHelper } from '@/services/discord';
import { JWTHelper } from '@/services/jwt';

export const makeDiscordAuthCallback = (): DiscordAuthCallbackController => {
  const userRepository = new PrismaUserRepository();
  const discordHelper = new DiscordHelper();
  const loadCredentialsDiscordUseCase = new LoadAuthCredentialsDiscordUseCase(
    discordHelper,
    userRepository,
    new JWTHelper(),
    new DiscordAuthPrismaRepository(),
  );

  return new DiscordAuthCallbackController(loadCredentialsDiscordUseCase);
};

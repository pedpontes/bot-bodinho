import { AuthDiscordController } from '@/modules/api/auth/use-cases/discord/controllers/auth-discord';

export const makeAuthDiscord = (): AuthDiscordController => {
  return new AuthDiscordController();
};

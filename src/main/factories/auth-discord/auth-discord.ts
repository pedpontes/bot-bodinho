import { RedirectDiscordProviderController } from '@/modules/api/discord/controllers/redirect-discord-provider';

export const makeAuthDiscord = (): RedirectDiscordProviderController => {
  return new RedirectDiscordProviderController();
};

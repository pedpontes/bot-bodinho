import { env } from '@/main/configs/config';
import { Controller, HttpResponse } from '@/presentation/protocols';
import {
  redirect,
  serverError,
} from '@/presentation/protocols/helpers/http-helper';

export class RedirectDiscordProviderController implements Controller {
  #CLIENT_ID: string;
  #REDIRECT_URI: string;

  constructor() {
    const { clientId, redirectUri } = env.oauth.discord;

    if (!clientId)
      throw new Error(
        '(RedirectDiscordProviderController) Missing discord OAUTH2_CLIENT_ID env',
      );
    if (!redirectUri)
      throw new Error(
        '(RedirectDiscordProviderController) Missing discord OAUTH2_REDIRECT_URI env',
      );

    this.#REDIRECT_URI = env.oauth.discord.redirectUri!;
    this.#CLIENT_ID = env.oauth.discord.clientId!;
  }

  async handle(): Promise<HttpResponse> {
    try {
      const params = new URLSearchParams({
        client_id: this.#CLIENT_ID,
        redirect_uri: this.#REDIRECT_URI,
        response_type: 'code',
        scope: 'identify guilds email',
      });

      return redirect(
        'https://discord.com/oauth2/authorize?' + params.toString(),
      );
    } catch (error) {
      return serverError(error);
    }
  }
}

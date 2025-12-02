import { Controller, HttpResponse } from '@/presentation/protocols';
import {
  redirect,
  serverError,
} from '@/presentation/protocols/helpers/http-helper';

export class RedirectDiscordProviderController implements Controller {
  constructor() {}

  async handle(): Promise<HttpResponse> {
    try {
      return redirect(
        'https://discord.com/oauth2/authorize?client_id=958710266051301396&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdiscord%2Fcallback&scope=identify+guilds+email',
      );
    } catch (error) {
      return serverError(error);
    }
  }
}

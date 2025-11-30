import { Controller, HttpResponse } from '@/presentation/protocols';
import {
  redirect,
  serverError,
} from '@/presentation/protocols/helpers/http-helper';

export class AuthDiscordController implements Controller {
  constructor() {}

  async handle(): Promise<HttpResponse> {
    try {
      return redirect(
        'https://discord.com/oauth2/authorize?client_id=958710266051301396&response_type=code&redirect_uri=https%3A%2F%2Fdodinho-discord.ddns.net%2Fwebhook%2Fdiscord%2Fauth&scope=identify+guilds+email',
      );
    } catch (error) {
      return serverError(error);
    }
  }
}

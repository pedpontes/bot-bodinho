import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/protocols';
import {
  badRequest,
  ok,
  serverError,
} from '@/presentation/protocols/helpers/http-helper';
import { LoadCredentialsDiscord } from '@/modules/api/webhooks/discord/use-case/auth/load-credentials';

export class DiscordAuthCallbackController implements Controller {
  constructor(
    private readonly loadCredentialsDiscord: LoadCredentialsDiscord,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const code =
        (request.query && (request.query.code as string | undefined)) ||
        (request.body && (request.body.code as string | undefined));

      if (!code) {
        return badRequest(
          new Error(
            '(authCallbackController) Código de autorização não informado.',
          ),
        );
      }

      const result = await this.loadCredentialsDiscord.load(code);

      return ok(result);
    } catch (error) {
      return serverError(error);
    }
  }
}

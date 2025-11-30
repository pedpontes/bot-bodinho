import { LoadAuthCredentialsByCodeDiscord } from '@/modules/api/discord/use-case/load-auth-credentials-by-code';
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

export class DiscordAuthCallbackController implements Controller {
  constructor(
    private readonly loadAuthCredentialsByCodeDiscord: LoadAuthCredentialsByCodeDiscord,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const code = request.query?.code as string;

      if (!code) {
        return badRequest(
          new Error(
            '(authCallbackController) Código de autorização não informado.',
          ),
        );
      }

      const result = await this.loadAuthCredentialsByCodeDiscord.load(code);

      return ok(result);
    } catch (error) {
      return serverError(error);
    }
  }
}

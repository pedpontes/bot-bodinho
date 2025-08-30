import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/protocols';
import {
  notFound,
  ok,
  serverError,
} from '@/presentation/protocols/helpers/http-helper';
import { LoadSessions } from '../use-case/load-sessions';

export class LoadSessionsController implements Controller {
  constructor(private readonly loadSessionsUseCase: LoadSessions) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = request.params;

      const response = id
        ? await this.loadSessionsUseCase.load(id)
        : await this.loadSessionsUseCase.loadAll();

      if (id && !response) return notFound();

      return ok(response);
    } catch (error) {
      return serverError(error);
    }
  }
}

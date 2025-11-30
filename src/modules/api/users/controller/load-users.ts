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
import { LoadUsers } from '../use-case/load-users';

export class LoadUsersController implements Controller {
  constructor(private readonly loadUsersUseCase: LoadUsers) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = request.params || {};

      const response = id
        ? await this.loadUsersUseCase.load(id)
        : await this.loadUsersUseCase.loadAll();

      if (id && !response) return notFound();

      return ok(response);
    } catch (error) {
      return serverError(error);
    }
  }
}


import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/protocols';
import {
  ok,
  serverError,
  unauthorized,
} from '@/presentation/protocols/helpers/http-helper';
import { LoadQueueByUser } from '../use-case/load-queue-by-user';

export class LoadCurrentQueueController implements Controller {
  constructor(private readonly loadQueueByUserUseCase: LoadQueueByUser) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      if (!request.user) return unauthorized();

      const response = await this.loadQueueByUserUseCase.execute(
        request.user.id,
      );

      return ok(response);
    } catch (error) {
      return serverError(error);
    }
  }
}


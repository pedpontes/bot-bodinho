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
import { LoadUploadsPagination } from '../use-case/load-uploads-pagination';

export class LoadUploadsPaginationController implements Controller {
  constructor(private loadUploadsPaginationUseCase: LoadUploadsPagination) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const user = request.user;
      const query = request.query;

      if (!user) return unauthorized();

      const uploads = await this.loadUploadsPaginationUseCase.loadAll(
        query,
        user,
      );

      return ok(uploads);
    } catch (error) {
      return serverError(error);
    }
  }
}

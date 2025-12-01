import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/protocols';
import {
  noContent,
  serverError,
  unauthorized,
} from '@/presentation/protocols/helpers/http-helper';
import { DeleteUpload } from '../use-case/delete-upload';

export class DeleteUploadController implements Controller {
  constructor(private deleteUploadUseCase: DeleteUpload) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = request.params || {};
      const { user } = request;

      if (!user) return unauthorized();

      await this.deleteUploadUseCase.delete(id, user);
      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}

import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/protocols';
import {
  badRequest,
  created,
  serverError,
  unauthorized,
} from '@/presentation/protocols/helpers/http-helper';
import { AddUploadUseCase } from '../use-case/add-upload';

export class AddUploadController implements Controller {
  constructor(private createUploadUseCase: AddUploadUseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      if (!request.user) return unauthorized();

      if (!request.file) return badRequest(new Error('No file provided'));

      if (!request.file?.mimetype.startsWith('audio/'))
        return badRequest(new Error('Only audio files are allowed'));

      const upload = await this.createUploadUseCase.add(
        request.file,
        request.user,
      );

      return created(upload);
    } catch (error) {
      return serverError(error);
    }
  }
}

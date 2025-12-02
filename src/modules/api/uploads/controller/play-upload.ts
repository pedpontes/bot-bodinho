import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/protocols';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '@/presentation/protocols/helpers/http-helper';
import { PlayUploadUseCase } from '../use-case/play-upload';
import { PlayUploadMusicUseCase } from '../use-case/play-upload-music';
import path from 'path';

export class PlayUploadController implements Controller {
  constructor(
    private readonly playUploadUseCase: PlayUploadUseCase,
    private readonly playUploadMusicUseCase: PlayUploadMusicUseCase,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      if (!request.user) return unauthorized();

      const { id } = request.params;
      const { upload, user } = await this.playUploadUseCase.execute(
        id,
        request.user.id,
      );

      const filePath = path.resolve(upload.path);
      await this.playUploadMusicUseCase.execute(
        filePath,
        user.discordAuth.discordId,
        upload.filename,
      );

      return ok({ message: 'Música tocando' });
    } catch (error: any) {
      if (error.message.includes('canal de voz')) {
        return badRequest(error);
      }
      return serverError(error);
    }
  }
}

import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/protocols';
import {
  badRequest,
  noContent,
  serverError,
} from '@/presentation/protocols/helpers/http-helper';
import { DeleteUser } from '../use-case/delete-user';

export class DeleteUserController implements Controller {
  constructor(private readonly deleteUserUseCase: DeleteUser) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = request.params || {};

      if (!id) return badRequest(new Error('id é obrigatório.'));

      await this.deleteUserUseCase.delete(id);

      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}

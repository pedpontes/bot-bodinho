import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/protocols';
import {
  badRequest,
  notFound,
  ok,
  serverError,
} from '@/presentation/protocols/helpers/http-helper';
import { UpdateUser } from '../use-case/update-user';

export class UpdateUserController implements Controller {
  constructor(private readonly updateUserUseCase: UpdateUser) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = request.params || {};

      if (!id) return badRequest(new Error('id é obrigatório.'));

      const { username, email, avatar } = request.body || {};

      const user = await this.updateUserUseCase.update(id, {
        username,
        email,
        avatar,
      });

      if (!user) return notFound();

      return ok(user);
    } catch (error) {
      return serverError(error);
    }
  }
}

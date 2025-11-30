import { UserProvidersEnum } from '@/domain/interfaces/user';
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/protocols';
import {
  badRequest,
  created,
  serverError,
} from '@/presentation/protocols/helpers/http-helper';
import { AddUser } from '../use-case/add-user';

export class CreateUserController implements Controller {
  constructor(private readonly addUserUseCase: AddUser) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { discordId, username, email, avatar } = request.body || {};

      if (!discordId) {
        return badRequest(new Error('discordId é obrigatório.'));
      }

      const user = await this.addUserUseCase.add({
        discordId,
        username,
        email,
        avatar,
        provider: UserProvidersEnum.PLATFORM,
      });

      return created(user);
    } catch (error) {
      return serverError(error);
    }
  }
}

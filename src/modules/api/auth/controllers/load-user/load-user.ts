import { UserRepository } from '@/infra/prisma/user-repository';
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/protocols';
import {
  notFound,
  ok,
  serverError,
  unauthorized,
} from '@/presentation/protocols/helpers/http-helper';

export class LoadUserController implements Controller {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { user } = httpRequest;

      if (!user) return unauthorized();

      const userResponse = await this.userRepository.loadById(user.id);

      if (!userResponse) return notFound();

      return ok(userResponse);
    } catch (e) {
      return serverError(e);
    }
  }
}

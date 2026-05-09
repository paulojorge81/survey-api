import type { LoadAccountByToken } from '@/domain/usecases/load-account-by-token';
import { AccessDeniedError } from '@/presentation/errors';
import { forbidden } from '@/presentation/helpers/http/http-helper';
import type { HttpRequest, HttpResponse } from '@/presentation/protocols';
import type { Middleware } from '@/presentation/protocols/middleware';

export class AuthMiddleware implements Middleware {
  constructor(private readonly loadAccountByToken: LoadAccountByToken) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token'];
    if (accessToken) {
      await this.loadAccountByToken.load(accessToken);
    }

    return forbidden(new AccessDeniedError());
  }
}

import { AccessDeniedError } from '@/presentation/errors';
import { forbidden } from '@/presentation/helpers/http/http-helper';
import type { HttpRequest, HttpResponse } from '@/presentation/protocols';
import type { Middleware } from '@/presentation/protocols/middleware';

export class AuthMiddleware implements Middleware {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return await Promise.resolve(forbidden(new AccessDeniedError()));
  }
}

import type {
  Authentication,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from '@/presentation/controllers/auth/login/login-controller-protocols';

import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper';

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }

      const {
        body: { email, password },
      } = httpRequest;

      const accessToken = await this.authentication.auth({ email, password });

      if (!accessToken) {
        return unauthorized();
      }

      return ok({
        accessToken,
      });
    } catch (error) {
      return serverError(error instanceof Error ? error : new Error('Internal server error'));
    }
  }
}

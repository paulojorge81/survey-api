import type { Authentication } from '@/domain/usecases';
import type { Controller, HttpResponse, Validation } from '@/presentation/protocols';

import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http-helper';

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation,
  ) {}

  async handle(request: LoginController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }

      const { email, password } = request;

      const athentictaionModel = await this.authentication.auth({ email, password });

      if (!athentictaionModel) {
        return unauthorized();
      }

      return ok(athentictaionModel);
    } catch (error) {
      return serverError(error instanceof Error ? error : new Error('Internal server error'));
    }
  }
}

export namespace LoginController {
  export type Request = {
    email: string;
    password: string;
  };
}

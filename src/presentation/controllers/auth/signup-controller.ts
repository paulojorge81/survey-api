import type { AddAccount, Authentication } from '@/domain/usecases';
import type { Controller, HttpResponse, Validation } from '@/presentation/protocols';

import { EmailInUseError } from '@/presentation/errors';
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers';

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication,
  ) {}
  async handle(request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }

      const { email, password, name } = request;
      const isValid = await this.addAccount.add({
        name,
        email,
        password,
      });

      if (!isValid) {
        return forbidden(new EmailInUseError());
      }
      const autheticationModel = await this.authentication.auth({ email, password });
      return ok(autheticationModel);
    } catch (error) {
      return serverError(error instanceof Error ? error : new Error('Internal server error'));
    }
  }
}

export namespace SignUpController {
  export type Request = {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
  };
}

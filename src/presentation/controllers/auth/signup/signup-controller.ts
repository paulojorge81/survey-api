import type {
  AddAccount,
  Authentication,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from '@/presentation/controllers/auth/signup/signup-controller-protocols';

import { EmailInUseError } from '@/presentation/errors';
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper';

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }

      const {
        body: { email, password, name },
      } = httpRequest;
      const account = await this.addAccount.add({
        name,
        email,
        password,
      });

      if (!account) {
        return forbidden(new EmailInUseError());
      }
      const accessToken = await this.authentication.auth({ email, password });
      return ok({ accessToken, account });
    } catch (error) {
      return serverError(error instanceof Error ? error : new Error('Internal server error'));
    }
  }
}

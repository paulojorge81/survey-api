import { badRequest, ok, serverError } from '../../helpers/http/http-helper';
import type { AddAccount, Authentication, Controller, HttpRequest, HttpResponse, Validation } from './signup-protocols';

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
      await this.authentication.auth({ email, password });
      return ok(account);
    } catch (error) {
      return serverError(error instanceof Error ? error : new Error('Internal server error'));
    }
  }
}

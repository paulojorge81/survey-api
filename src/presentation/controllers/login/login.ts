import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, serverError } from "../../helpers/http-helper";
import { HttpStatusCode } from "../../http/http-status-code";
import type { Controller, HttpRequest, HttpResponse } from "../../protocols";
import type { EmailValidator } from "../signup/signup-protocols";

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;
  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {

    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { body: { email } } = httpRequest
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError("email"))
      }

      return await Promise.resolve({
        statusCode: HttpStatusCode.SUCCESS,
        body: null
      });
    } catch (error) {
      return serverError(error instanceof Error ? error : new Error('Internal server error'))
    }
  }
}

import { InvalidParamError, MissingParamError } from "../errors";
import { badRequest, serverError } from "../helpers/http-helper";
import { HttpStatusCode } from "../http/http-status-code";
import type { Controller, EmailValidator, HttpRequest, HttpResponse } from "../protocols";

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }
  handle(httpRequest: HttpRequest): HttpResponse {
    try {

      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { body: { email, password, passwordConfirmation } } = httpRequest

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError("email"))
      }
      return {
        statusCode: HttpStatusCode.SUCCESS,
        body: {}
      }
    } catch (error) {
      return serverError()
    }

  }
}

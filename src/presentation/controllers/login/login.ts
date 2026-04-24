import { MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helper";
import { HttpStatusCode } from "../../http/http-status-code";
import type { Controller, HttpRequest, HttpResponse } from "../../protocols";

export class Login implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {

    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'))
    }

    return await Promise.resolve({
      statusCode: HttpStatusCode.SUCCESS,
      body: null
    });
  }
}

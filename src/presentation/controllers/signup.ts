import { HttpStatusCode } from "../http/http-status-code";
import type { HttpRequest, HttpResponse } from "../protocols/http";

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return {
        statusCode: HttpStatusCode.BAD_REQUEST,
        body: new Error("Missing param: name")
      }
    }
    if (!httpRequest.body.email) {
      return {
        statusCode: HttpStatusCode.BAD_REQUEST,
        body: new Error("Missing param: email")
      }
    }
    return {
      statusCode: HttpStatusCode.SERVER_ERROR,
      body: {}
    }
  }

}

import { HttpStatusCode } from "../http/http-status-code";

export class SignUpController {
  handle(httpRequest: any): any {
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
  }
}

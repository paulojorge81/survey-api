import { HttpStatusCode } from "../http/http-status-code";

export class SignUpController {
  handle(httpRequest: unknown): unknown {
    return {
      statusCode: HttpStatusCode.BAD_REQUEST
    }
  }
}

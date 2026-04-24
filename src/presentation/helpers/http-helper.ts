import { ServerError } from "../errors";
import { HttpStatusCode } from "../http/http-status-code";
import type { HttpResponse } from "../protocols/http";

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: HttpStatusCode.BAD_REQUEST,
  body: error
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: HttpStatusCode.SERVER_ERROR,
  body: new ServerError(error.stack ?? error.message)
})

export const ok = (data: any): HttpResponse => ({
  statusCode: HttpStatusCode.SUCCESS,
  body: data
})

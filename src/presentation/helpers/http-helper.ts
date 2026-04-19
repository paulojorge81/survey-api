import { ServerError } from "../errors/server-error";
import { HttpStatusCode } from "../http/http-status-code";
import type { HttpResponse } from "../protocols/http";

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: HttpStatusCode.BAD_REQUEST,
  body: error
})

export const serverError = (): HttpResponse => ({
  statusCode: HttpStatusCode.SERVER_ERROR,
  body: new ServerError()
})

export const ok = (data: any): HttpResponse => ({
  statusCode: HttpStatusCode.SUCCESS,
  body: data
})

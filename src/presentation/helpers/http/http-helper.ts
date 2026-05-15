import type { HttpResponse } from '@/presentation/protocols';

import { ServerError, UnauthorizedError } from '@/presentation/errors';
import { HttpStatusCode } from '@/presentation/http/http-status-code';

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: HttpStatusCode.BAD_REQUEST,
  body: error,
});

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: HttpStatusCode.FORBIDDEN,
  body: error,
});

export const serverError = (error: Error): HttpResponse => ({
  statusCode: HttpStatusCode.SERVER_ERROR,
  body: new ServerError(error.stack ?? error.message),
});

export const unauthorized = (): HttpResponse => ({
  statusCode: HttpStatusCode.UNAUTHORIZED,
  body: new UnauthorizedError(),
});

export const ok = (data: any): HttpResponse => ({
  statusCode: HttpStatusCode.SUCCESS,
  body: data,
});

export const noContent = (): HttpResponse => ({
  statusCode: HttpStatusCode.NO_CONTENT,
  body: null,
});

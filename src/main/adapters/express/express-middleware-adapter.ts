import type { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '@/presentation/http/http-status-code';
import type { HttpRequest, HttpResponse, Middleware } from '@/presentation/protocols';

export const adaptMiddleware = (middleware: Middleware) => async (req: Request, res: Response, next: NextFunction) => {
  const httpRequest: HttpRequest = {
    headers: req.headers,
  };
  const httpResponse: HttpResponse = await middleware.handle(httpRequest);
  if (httpResponse.statusCode === HttpStatusCode.SUCCESS) {
    Object.assign(req, httpResponse.body);
    next();
  } else {
    res.status(httpResponse.statusCode).json({ error: httpResponse.body.message });
  }
};

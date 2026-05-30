/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { NextFunction, Request, Response } from 'express';

import type { HttpResponse, Middleware } from '@/presentation/protocols';

import { HttpStatusCode } from '@/presentation/http';

export const adaptMiddleware = (middleware: Middleware) => async (req: Request, res: Response, next: NextFunction) => {
  const httpRequest = {
    accessToken: req.headers?.['x-access-token'],
    ...(req.headers || {}),
  };
  const httpResponse: HttpResponse = await middleware.handle(httpRequest);
  if (httpResponse.statusCode === HttpStatusCode.SUCCESS) {
    Object.assign(req, httpResponse.body);
    next();
  } else {
    res.status(httpResponse.statusCode).json({ error: httpResponse.body.message });
  }
};

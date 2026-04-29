import type { Request, Response } from 'express';
import type { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols';
import { HttpStatusCode } from '../../presentation/http/http-status-code';

export const adaptRoute = (controller: Controller) => async (req: Request, res: Response) => {
  const httpRequest: HttpRequest = {
    body: req.body,
  };
  const httpResponse: HttpResponse = await controller.handle(httpRequest);
  if (httpResponse.statusCode === HttpStatusCode.SUCCESS) {
    res.status(httpResponse.statusCode).json(httpResponse.body);
  } else {
    res.status(httpResponse.statusCode).json({ error: httpResponse.body.message });
  }
};

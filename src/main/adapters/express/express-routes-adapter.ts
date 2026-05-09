import type { Request, Response } from 'express';
import { HttpStatusCode } from '@/presentation/http/http-status-code';
import type { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';

export const adaptRoute = (controller: Controller) => async (req: Request, res: Response) => {
  const httpRequest: HttpRequest = {
    body: req.body,
  };
  const httpResponse: HttpResponse = await controller.handle(httpRequest);
  const SUCCESS_FINAL_RANGE = 299;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
  if (httpResponse.statusCode >= HttpStatusCode.SUCCESS || httpResponse.statusCode <= SUCCESS_FINAL_RANGE) {
    res.status(httpResponse.statusCode).json(httpResponse.body);
  } else {
    res.status(httpResponse.statusCode).json({ error: httpResponse.body.message });
  }
};

/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type { Request, Response } from 'express';

import type { Controller, HttpResponse } from '@/presentation/protocols';

import { HttpStatusCode } from '@/presentation/http';

export const adaptRoute = (controller: Controller) => async (req: Request, res: Response) => {
  const request = {
    ...(req.body || {}),
    ...(req.params || {}),
    accountId: req.accountId,
  };
  const httpResponse: HttpResponse = await controller.handle(request);
  const SUCCESS_FINAL_RANGE = 299;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
  if (httpResponse.statusCode >= HttpStatusCode.SUCCESS && httpResponse.statusCode <= SUCCESS_FINAL_RANGE) {
    res.status(httpResponse.statusCode).json(httpResponse.body);
  } else {
    res.status(httpResponse.statusCode).json({ error: httpResponse.body.message });
  }
};

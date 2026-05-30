import type { LogErrorRepository } from '@/data/protocols';
import type { Controller, HttpResponse } from '@/presentation/protocols';

import { HttpStatusCode } from '@/presentation/http';

export class LogControllerDecorator implements Controller {
  constructor(
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository,
  ) {}
  async handle(request: any): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(request);
    if (httpResponse.statusCode === HttpStatusCode.SERVER_ERROR) {
      await this.logErrorRepository.logError(httpResponse.body.stack);
    }
    return httpResponse;
  }
}

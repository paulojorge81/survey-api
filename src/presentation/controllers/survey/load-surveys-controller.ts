import type { LoadSurveys } from '@/domain/usecases';
import type { Controller, HttpResponse } from '@/presentation/protocols';

import { noContent, ok, serverError } from '@/presentation/helpers/http-helper';

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}

  async handle(request: LoadSurveysController.Request): Promise<HttpResponse> {
    try {
      const { accountId } = request;
      const EMPTY = 0;
      const surveys = await this.loadSurveys.load(accountId);
      return surveys.length === EMPTY ? noContent() : ok(surveys);
    } catch (error) {
      return serverError(error instanceof Error ? error : new Error('Internal server error'));
    }
  }
}

export namespace LoadSurveysController {
  export type Request = {
    accountId: string;
  };
}

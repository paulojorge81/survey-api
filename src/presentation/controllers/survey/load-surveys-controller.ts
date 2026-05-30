import type { LoadSurveys } from '@/domain/usecases';
import type { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';

import { noContent, ok, serverError } from '@/presentation/helpers/http-helper';

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { accountId } = httpRequest;
      const EMPTY = 0;
      const surveys = await this.loadSurveys.load(accountId ?? '');
      return surveys.length === EMPTY ? noContent() : ok(surveys);
    } catch (error) {
      return serverError(error instanceof Error ? error : new Error('Internal server error'));
    }
  }
}

import type {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveys,
} from '@/presentation/controllers/survey/load-surveys/load-surveys-controller-protocols';

import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helper';

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const EMPTY = 0;
      const surveys = await this.loadSurveys.load();
      if (surveys.length === EMPTY) {
        return noContent();
      }

      return ok(surveys);
    } catch (error) {
      return serverError(error instanceof Error ? error : new Error('Internal server error'));
    }
  }
}

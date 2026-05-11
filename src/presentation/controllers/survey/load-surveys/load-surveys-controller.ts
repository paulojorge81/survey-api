import type {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveys,
} from '@/presentation/controllers/survey/load-surveys/load-surveys-controller-protocols';
import { ok, serverError } from '@/presentation/helpers/http/http-helper';

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load();

      return ok(surveys);
    } catch (error) {
      return serverError(error instanceof Error ? error : new Error('Internal server error'));
    }
  }
}

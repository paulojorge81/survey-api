import type {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
} from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller-protocols';

import { HttpStatusCode } from '@/presentation/http/http-status-code';

export class LoadSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}

  async handle(httpeRequest: HttpRequest): Promise<HttpResponse> {
    const {
      params: { surveyId },
    } = httpeRequest;
    await this.loadSurveyById.loadById(surveyId);
    return await Promise.resolve({
      body: {},
      statusCode: HttpStatusCode.SUCCESS,
    });
  }
}

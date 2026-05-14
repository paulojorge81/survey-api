import { HttpStatusCode } from '@/presentation/http/http-status-code';
import type {
  LoadSurveyById,
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller-protocols';

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveyById.loadById(httpRequest.params.surveyId);
    return await Promise.resolve({ body: {}, statusCode: HttpStatusCode.SUCCESS });
  }
}

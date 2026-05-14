import { HttpStatusCode } from '@/presentation/http/http-status-code';
import type {
  LoadSurveyById,
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller-protocols';
import { forbidden } from '@/presentation/helpers/http/http-helper';
import { InvalidParamError } from '@/presentation/errors';

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId);
    if (!survey) {
      return forbidden(new InvalidParamError('surveyId'));
    }
    return await Promise.resolve({ body: {}, statusCode: HttpStatusCode.SUCCESS });
  }
}

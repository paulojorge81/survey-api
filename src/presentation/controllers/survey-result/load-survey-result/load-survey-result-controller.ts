import type {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
} from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller-protocols';

import { InvalidParamError } from '@/presentation/errors';
import { forbidden } from '@/presentation/helpers/http/http-helper';
import { HttpStatusCode } from '@/presentation/http/http-status-code';

export class LoadSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}

  async handle(httpeRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const {
        params: { surveyId },
      } = httpeRequest;
      const survey = await this.loadSurveyById.loadById(surveyId);
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }
      return await Promise.resolve({
        body: {},
        statusCode: HttpStatusCode.SUCCESS,
      });
    } catch (error) {
      return {
        body: {},
        statusCode: HttpStatusCode.SERVER_ERROR,
      };
    }
  }
}

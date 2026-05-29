import type {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
  LoadSurveyResult,
} from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller-protocols';

import { InvalidParamError } from '@/presentation/errors';
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper';

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult,
  ) {}

  async handle(httpeRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const {
        params: { surveyId },
        accountId,
      } = httpeRequest;
      const survey = await this.loadSurveyById.loadById(surveyId);
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }
      const suvreyResult = await this.loadSurveyResult.load(surveyId, accountId ?? '');
      return ok(suvreyResult);
    } catch (error) {
      return serverError(error instanceof Error ? error : new Error('Internal server error'));
    }
  }
}

import type { CheckSurveyById, LoadSurveyResult } from '@/domain/usecases';
import type { Controller, HttpResponse } from '@/presentation/protocols';

import { InvalidParamError } from '@/presentation/errors';
import { forbidden, ok, serverError } from '@/presentation/helpers/http-helper';

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly checkSurveyById: CheckSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult,
  ) {}

  async handle(request: LoadSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { surveyId, accountId } = request;
      const exists = await this.checkSurveyById.checkById(surveyId);
      if (!exists) {
        return forbidden(new InvalidParamError('surveyId'));
      }
      const suvreyResult = await this.loadSurveyResult.load(surveyId, accountId);
      return ok(suvreyResult);
    } catch (error) {
      return serverError(error instanceof Error ? error : new Error('Internal server error'));
    }
  }
}

export namespace LoadSurveyResultController {
  export type Request = {
    surveyId: string;
    accountId: string;
  };
}

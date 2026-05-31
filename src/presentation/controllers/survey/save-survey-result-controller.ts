import type { LoadAnswersBySurvey, SaveSurveyResult } from '@/domain/usecases';
import type { Controller, HttpResponse } from '@/presentation/protocols';

import { InvalidParamError } from '@/presentation/errors';
import { forbidden, ok, serverError } from '@/presentation/helpers/http-helper';

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadAnswersBySurvey: LoadAnswersBySurvey,
    private readonly saveSurveyResult: SaveSurveyResult,
  ) {}
  async handle(request: SaveSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { surveyId, answer, accountId } = request;
      const answers = await this.loadAnswersBySurvey.loadAnswers(surveyId);
      if (!answers?.length) {
        return forbidden(new InvalidParamError('surveyId'));
      } else if (!answers.includes(answer)) {
        return forbidden(new InvalidParamError('answer'));
      }

      const surveyResult = await this.saveSurveyResult.save({
        accountId,
        surveyId,
        answer,
        date: new Date(),
      });

      return ok(surveyResult);
    } catch (error) {
      return serverError(error instanceof Error ? error : new Error('Internal server error'));
    }
  }
}

export namespace SaveSurveyResultController {
  export type Request = {
    surveyId: string;
    accountId: string;
    answer: string;
  };
}

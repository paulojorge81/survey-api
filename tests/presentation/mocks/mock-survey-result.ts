import type { LoadSurveyResult } from '@/domain/usecases/load-survey-result';
import type { SaveSurveyResult } from '@/domain/usecases/save-survey-result';

import { mockSurveyResultModel } from '@/tests/domain/mocks';

export class SaveSurveyResultSpy implements SaveSurveyResult {
  result = mockSurveyResultModel();
  saveSurveyResultParams!: SaveSurveyResult.Params;

  async save(data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
    this.saveSurveyResultParams = data;
    return await Promise.resolve(this.result);
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  result = mockSurveyResultModel();
  surveyId!: string;
  accountId!: string;

  async load(surveyId: string, accountId: string): Promise<LoadSurveyResult.Result> {
    this.surveyId = surveyId;
    this.accountId = accountId;
    return await Promise.resolve(this.result);
  }
}

import type { SurveyResultModel } from '@/domain/models/survey-result';
import type { LoadSurveyResult } from '@/domain/usecases/load-survey-result';
import type { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases/save-survey-result';

import { mockSurveyResultModel } from '@/tests/domain/mocks';

export class SaveSurveyResultSpy implements SaveSurveyResult {
  surveyResultModel = mockSurveyResultModel();
  saveSurveyResultParams!: SaveSurveyResultParams;

  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    this.saveSurveyResultParams = data;
    return await Promise.resolve(this.surveyResultModel);
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  surveyResultModel = mockSurveyResultModel();
  surveyId!: string;
  accountId!: string;

  async load(surveyId: string, accountId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId;
    this.accountId = accountId;
    return await Promise.resolve(this.surveyResultModel);
  }
}

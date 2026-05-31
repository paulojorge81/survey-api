import type { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository';
import type { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository';
import type { SaveSurveyResult } from '@/domain/usecases';

import { mockSurveyResultModel } from '@/tests/domain/mocks';

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  saveSurveyResultParams!: SaveSurveyResult.Params;

  async save(data: SaveSurveyResult.Params): Promise<void> {
    this.saveSurveyResultParams = data;
    await Promise.resolve();
  }
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  result: LoadSurveyResultRepository.Result | null = mockSurveyResultModel();
  surveyId!: string;
  accountId!: string;

  async loadBySurveyId(surveyId: string, accountId: string): Promise<LoadSurveyResultRepository.Result | null> {
    this.surveyId = surveyId;
    this.accountId = accountId;
    return await Promise.resolve(this.result);
  }
}

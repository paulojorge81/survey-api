import type { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository';
import type { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository';
import type { SurveyResultModel } from '@/domain/models/survey-result';
import type { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result';

import { mockSurveyResultModel } from '@/domain/test';

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  saveSurveyResultParams!: SaveSurveyResultParams;

  async save(data: SaveSurveyResultParams): Promise<void> {
    this.saveSurveyResultParams = data;
    await Promise.resolve();
  }
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  surveyResultModel: SurveyResultModel | null = mockSurveyResultModel();
  surveyId!: string;

  async loadBySurveyId(surveyId: string): Promise<SurveyResultModel | null> {
    this.surveyId = surveyId;
    return await Promise.resolve(this.surveyResultModel);
  }
}

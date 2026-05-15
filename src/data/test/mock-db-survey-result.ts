import type { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository';
import type { SurveyResultModel } from '@/domain/models/survey-result';
import type { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result';

import { mockSurveyResultModel } from '@/domain/test';

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyResultModel());
    }
  }

  return new SaveSurveyResultRepositoryStub();
};

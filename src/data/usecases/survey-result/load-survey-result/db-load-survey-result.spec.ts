import type { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository';
import type { SurveyResultModel } from '@/data/usecases/survey-result/load-survey-result/db-load-survey-result-protocols';

import { DbLoadSurveyResult } from '@/data/usecases/survey-result/load-survey-result/db-load-survey-result';
import { mockSurveyResultModel } from '@/domain/test';

type SutTypes = {
  sut: DbLoadSurveyResult;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
};

const mockLoadSurveyResultRespository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultReporitoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyResultModel());
    }
  }

  return new LoadSurveyResultReporitoryStub();
};

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRespository();
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub);
  return { sut, loadSurveyResultRepositoryStub };
};

describe('DbLoadSurveyResult UseCase', () => {
  test('Should call LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    const loadBySurveyId = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId');
    await sut.load('any_survey_id');
    expect(loadBySurveyId).toHaveBeenCalledWith('any_survey_id');
  });
});

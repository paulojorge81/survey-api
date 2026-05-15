import type { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';
import type { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import type { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository';
import type { SurveyModel } from '@/domain/models/surveys';
import type { AddSurveyParams } from '@/domain/usecases/survey/add-survey';

import { mockSurveyModel, mockSurveyModels } from '@/domain/test';

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(data: AddSurveyParams): Promise<void> {
      await Promise.resolve();
    }
  }

  return new AddSurveyRepositoryStub();
};

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(id: string): Promise<SurveyModel> {
      return await Promise.resolve(mockSurveyModel());
    }
  }

  return new LoadSurveysRepositoryStub();
};

export const mmockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(): Promise<SurveyModel[]> {
      return await Promise.resolve(mockSurveyModels());
    }
  }

  return new LoadSurveysRepositoryStub();
};

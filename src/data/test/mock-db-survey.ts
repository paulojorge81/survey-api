/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';
import type { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import type { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository';
import type { SurveyModel } from '@/domain/models/surveys';
import type { AddSurveyParams } from '@/domain/usecases/survey/add-survey';

import { mockSurveyModel, mockSurveyModels } from '@/domain/test';

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  addSurveyParams!: AddSurveyParams;

  async add(data: AddSurveyParams): Promise<void> {
    this.addSurveyParams = data;
    await Promise.resolve();
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  surveyModel = mockSurveyModel();
  id!: string;

  async loadById(id: string): Promise<SurveyModel> {
    this.id = id;
    return await Promise.resolve(this.surveyModel);
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  surveyModels = mockSurveyModels();
  callsCount = 0;

  async loadAll(): Promise<SurveyModel[]> {
    this.callsCount++;
    return await Promise.resolve(this.surveyModels);
  }
}

import type { SurveyModel } from '@/domain/models/surveys';
import type { AddSurvey } from '@/domain/usecases/add-survey';
import type { LoadSurveyById } from '@/domain/usecases/load-survey-by-id';
import type { LoadSurveys } from '@/domain/usecases/load-surveys';

import { mockSurveyModel, mockSurveyModels } from '@/tests/domain/mocks';

export class AddSurveySpy implements AddSurvey {
  addSurveyParams!: AddSurvey.Params;

  async add(data: AddSurvey.Params): Promise<void> {
    this.addSurveyParams = data;
    await Promise.resolve();
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  surveyModels = mockSurveyModels();
  accountId!: string;

  async load(accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId;
    return await Promise.resolve(this.surveyModels);
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  surveyModel: SurveyModel | null = mockSurveyModel();
  id!: string;

  async loadById(id: string): Promise<SurveyModel | null> {
    this.id = id;
    return await Promise.resolve(this.surveyModel);
  }
}

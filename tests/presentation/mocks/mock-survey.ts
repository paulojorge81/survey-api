import { faker } from '@faker-js/faker';

import type { SurveyModel } from '@/domain/models/surveys';
import type { CheckSurveyById, LoadAnswersBySurvey } from '@/domain/usecases';
import type { AddSurvey } from '@/domain/usecases/add-survey';
import type { LoadSurveys } from '@/domain/usecases/load-surveys';

import { mockSurveyModels } from '@/tests/domain/mocks';

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

export class LoadAnswersBySurveySpy implements LoadAnswersBySurvey {
  result = [faker.word.words(), faker.word.words()];
  id!: string;

  async loadAnswers(id: string): Promise<LoadAnswersBySurvey.Result> {
    this.id = id;
    return await Promise.resolve(this.result);
  }
}

export class CheckSurveyByIdSpy implements CheckSurveyById {
  result: CheckSurveyById.Result = true;
  id!: string;

  async checkById(id: string): Promise<CheckSurveyById.Result> {
    this.id = id;
    return await Promise.resolve(this.result);
  }
}

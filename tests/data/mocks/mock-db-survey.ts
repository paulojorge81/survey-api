import { faker } from '@faker-js/faker';

import type {
  AddSurveyRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository,
  CheckSurveyByIdRepository,
  LoadAnswersBySurveyRepository,
} from '@/data/protocols';
import type { SurveyModel } from '@/domain/models/surveys';

import { mockSurveyModel, mockSurveyModels } from '@/tests/domain/mocks';

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  addSurveyParams!: AddSurveyRepository.Params;

  async add(data: AddSurveyRepository.Params): Promise<void> {
    this.addSurveyParams = data;
    await Promise.resolve();
  }
}

export class CheckSurveyByIdRepositorySpy implements CheckSurveyByIdRepository {
  result = true;
  id!: string;

  async checkById(id: string): Promise<CheckSurveyByIdRepository.Result> {
    this.id = id;
    return await Promise.resolve(this.result);
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  result: LoadSurveyByIdRepository.Result | null = mockSurveyModel();
  id!: string;

  async loadById(id: string): Promise<LoadSurveyByIdRepository.Result | null> {
    this.id = id;
    return await Promise.resolve(this.result);
  }
}

export class LoadAnswersBySurveyRepositorySpy implements LoadAnswersBySurveyRepository {
  result: LoadAnswersBySurveyRepository.Result = [faker.word.words(), faker.word.words()];
  id!: string;

  async loadAnswers(id: string): Promise<LoadAnswersBySurveyRepository.Result> {
    this.id = id;
    return await Promise.resolve(this.result);
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  surveyModels = mockSurveyModels();
  accountId!: string;

  async loadAll(accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId;
    return await Promise.resolve(this.surveyModels);
  }
}

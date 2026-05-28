/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable no-plusplus */
import type { SurveyModel } from '@/domain/models/surveys';
import type { AddSurvey, AddSurveyParams } from '@/domain/usecases/survey/add-survey';
import type { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import type { LoadSurveys } from '@/domain/usecases/survey/load-surveys';

import { mockSurveyModel, mockSurveyModels } from '@/domain/test';

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add(data: AddSurveyParams): Promise<void> {
      await Promise.resolve();
    }
  }

  return new AddSurveyStub();
};

export const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return await Promise.resolve(mockSurveyModels());
    }
  }

  return new LoadSurveysStub();
};

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel | null> {
      return await Promise.resolve(mockSurveyModel());
    }
  }

  return new LoadSurveyByIdStub();
};

export class AddSurveySpy implements AddSurvey {
  addSurveyParams!: AddSurveyParams;

  async add(data: AddSurveyParams): Promise<void> {
    this.addSurveyParams = data;
    await Promise.resolve();
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  surveyModels = mockSurveyModels();
  callsCount = 0;

  async load(): Promise<SurveyModel[]> {
    this.callsCount++;
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

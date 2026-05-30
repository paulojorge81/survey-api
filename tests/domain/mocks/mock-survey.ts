import { faker } from '@faker-js/faker';

import type { SurveyModel } from '@/domain/models/surveys';
import type { AddSurveyParams } from '@/domain/usecases/add-survey';

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: faker.word.words(),
  answers: [
    {
      image: faker.image.url(),
      answer: faker.word.words(),
    },
    {
      answer: faker.word.words(),
    },
  ],
  date: new Date(),
});

export const mockSurveyModel = (): SurveyModel => ({
  id: faker.string.uuid(),
  ...mockAddSurveyParams(),
});

export const mockSurveyModels = (): SurveyModel[] => [mockSurveyModel(), mockSurveyModel()];

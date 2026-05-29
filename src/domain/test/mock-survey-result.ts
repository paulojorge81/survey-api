/* eslint-disable @typescript-eslint/no-magic-numbers */
import { faker } from '@faker-js/faker';

import type { SurveyResultModel } from '@/domain/models/survey-result';
import type { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result';

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: faker.string.uuid(),
  surveyId: faker.string.uuid(),
  answer: faker.word.words(),
  date: faker.date.recent(),
});

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: faker.string.uuid(),
  question: faker.word.words(),
  answers: [
    {
      answer: faker.word.words(),
      count: faker.number.int({ min: 0, max: 100 }),
      percent: faker.number.int({ min: 0, max: 100 }),
      isCurrentAccountAnswer: faker.datatype.boolean(),
    },
    {
      answer: faker.word.words(),
      image: faker.image.url(),
      count: faker.number.int({ min: 0, max: 100 }),
      percent: faker.number.int({ min: 0, max: 100 }),
      isCurrentAccountAnswer: faker.datatype.boolean(),
    },
  ],
  date: faker.date.recent(),
});

export const mockEmptySurveyResultModel = (): SurveyResultModel => ({
  surveyId: faker.string.uuid(),
  question: faker.word.words(),
  answers: [
    {
      answer: faker.word.words(),
      count: 0,
      percent: 0,
      isCurrentAccountAnswer: false,
    },
    {
      answer: faker.word.words(),
      image: faker.image.url(),
      count: 0,
      percent: 0,
      isCurrentAccountAnswer: false,
    },
  ],
  date: faker.date.recent(),
});

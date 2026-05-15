import type { SurveyModel } from '@/domain/models/surveys';
import type { AddSurveyParams } from '@/domain/usecases/survey/add-survey';

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
  date: new Date(),
});

export const mockSurveyModel = (): SurveyModel => ({
  id: 'any_id',
  ...mockAddSurveyParams(),
});

export const mockSurveyModels = (): SurveyModel[] => [mockSurveyModel()];

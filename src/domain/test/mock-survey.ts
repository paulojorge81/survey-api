import type { SurveyModel } from '@/domain/models/surveys';
import type { AddSurveyParams } from '@/domain/usecases/survey/add-survey';

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [{ answer: 'any_answer' }, { answer: 'other_answer', image: 'any_image' }],
  date: new Date(),
});

export const mockSurveyModel = (): SurveyModel => ({
  id: 'any_id',
  ...mockAddSurveyParams(),
});

export const mockSurveyModels = (): SurveyModel[] => [mockSurveyModel()];

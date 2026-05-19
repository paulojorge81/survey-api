import type { SurveyResultModel } from '@/domain/models/survey-result';

export interface SaveSurveyResult {
  save: (surveyId: string) => Promise<SurveyResultModel>;
}

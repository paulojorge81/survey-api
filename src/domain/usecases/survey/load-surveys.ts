import type { SurveyModel } from '@/domain/models/surveys';

export interface LoadSurveys {
  load: (accountId: string) => Promise<SurveyModel[]>;
}

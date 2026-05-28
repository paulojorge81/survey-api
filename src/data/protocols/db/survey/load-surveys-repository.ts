import type { SurveyModel } from '@/domain/models/surveys';

export interface LoadSurveysRepository {
  loadAll: (accountId: string) => Promise<SurveyModel[]>;
}

import type { SurveyModel } from '@/domain/models/surveys';

export interface LoadSurveysRepository {
  loadAll: (accountId: string) => Promise<LoadSurveysRepository.Result>;
}

export namespace LoadSurveysRepository {
  export type Result = SurveyModel[];
}

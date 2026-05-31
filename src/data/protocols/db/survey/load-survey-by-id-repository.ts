import type { SurveyModel } from '@/domain/models/surveys';

export interface LoadSurveyByIdRepository {
  loadById: (id: string) => Promise<LoadSurveyByIdRepository.Result | null>;
}

export namespace LoadSurveyByIdRepository {
  export type Result = SurveyModel;
}

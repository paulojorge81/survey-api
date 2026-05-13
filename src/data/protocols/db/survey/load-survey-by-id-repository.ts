import type { SurveyModel } from '@/domain/models/surveys';

export interface LoadSurveyByIdRepository {
  loadById: (id: string) => Promise<SurveyModel | null>;
}

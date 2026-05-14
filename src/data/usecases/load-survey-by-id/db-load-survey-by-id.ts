/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type {
  LoadSurveyById,
  LoadSurveyByIdRepository,
  SurveyModel,
} from '@/data/usecases/load-survey-by-id/db-load-survey-by-id-protocols';

export class DbLoadSurveyById implements LoadSurveyById {
  constructor(private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}

  async loadById(id: string): Promise<SurveyModel> {
    const survey = await this.loadSurveyByIdRepository.loadById(id);
    return survey!;
  }
}

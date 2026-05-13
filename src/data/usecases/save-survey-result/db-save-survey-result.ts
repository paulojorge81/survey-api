import type {
  SaveSurveyResultRepository,
  SurveyResultModel,
  SaveSurveyResult,
  SaveSurveyResultModel,
} from '@/data/usecases/save-survey-result/db-save-survey-result-protocols';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(private readonly saveSurveyResultRepository: SaveSurveyResultRepository) {}

  async save(data: SaveSurveyResultModel): Promise<SurveyResultModel | null> {
    await this.saveSurveyResultRepository.save(data);
    return null;
  }
}

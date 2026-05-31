import type { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data/protocols';
import type { SaveSurveyResult } from '@/domain/usecases';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
  ) {}

  async save(data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result | null> {
    await this.saveSurveyResultRepository.save(data);
    const surveyResult: SaveSurveyResult.Result | null = await this.loadSurveyResultRepository.loadBySurveyId(
      data.surveyId.toString(),
      data.accountId.toString(),
    );
    return surveyResult;
  }
}

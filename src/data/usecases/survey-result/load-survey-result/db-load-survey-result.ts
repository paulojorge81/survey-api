import type { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository';
import type { SurveyResultModel } from '@/data/usecases/survey-result/load-survey-result/db-load-survey-result-protocols';
import type { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result';

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(private readonly loadSurveyResultRepository: LoadSurveyResultRepository) {}
  async load(surveyId: string): Promise<SurveyResultModel> {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId);
    return surveyResult;
  }
}

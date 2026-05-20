import type { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository';
import type { SurveyResultModel } from '@/data/usecases/survey-result/load-survey-result/db-load-survey-result-protocols';
import type { LoadSurveyByIdRepository } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols';
import type { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result';

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository,
  ) {}
  async load(surveyId: string): Promise<SurveyResultModel | null> {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId);
    if (!surveyResult) {
      await this.loadSurveyByIdRepository.loadById(surveyId);
    }
    return surveyResult;
  }
}

import type { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository';
import type { SurveyResultModel } from '@/data/usecases/survey-result/load-survey-result/db-load-survey-result-protocols';
import type { LoadSurveyByIdRepository } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols';
import type { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result';

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository,
  ) {}
  async load(surveyId: string, accountId: string): Promise<SurveyResultModel | null> {
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId, accountId);
    if (!surveyResult) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId);
      if (survey) {
        const EMPTY = 0;
        surveyResult = {
          surveyId: survey.id,
          question: survey.question,
          date: survey.date,
          answers: survey.answers.map((answer) => ({
            count: EMPTY,
            percent: EMPTY,
            isCurrentAccountAnswer: false,
            ...answer,
          })),
        };
      }
    }
    return surveyResult;
  }
}

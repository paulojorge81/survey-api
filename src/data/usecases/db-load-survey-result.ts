import type { LoadSurveyByIdRepository, LoadSurveyResultRepository } from '@/data/protocols';
import type { SurveyModel, SurveyResultModel } from '@/domain/models';
import type { LoadSurveyResult } from '@/domain/usecases';

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository,
  ) {}
  async load(surveyId: string, accountId: string): Promise<SurveyResultModel | null> {
    let surveyResult: SurveyResultModel | null = await this.loadSurveyResultRepository.loadBySurveyId(
      surveyId,
      accountId,
    );
    if (!surveyResult) {
      const survey: SurveyModel | null = await this.loadSurveyByIdRepository.loadById(surveyId);
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

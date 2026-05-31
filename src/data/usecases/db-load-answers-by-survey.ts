import type { LoadAnswersBySurveyRepository } from '@/data/protocols';
import type { LoadAnswersBySurvey } from '@/domain/usecases';

export class DbLoadAnswersBySurvey implements LoadAnswersBySurvey {
  constructor(private readonly loadAnswersBySurveyRepository: LoadAnswersBySurveyRepository) {}

  async loadAnswers(id: string): Promise<LoadAnswersBySurveyRepository.Result> {
    return await this.loadAnswersBySurveyRepository.loadAnswers(id);
  }
}

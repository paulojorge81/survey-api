import type { LoadSurveys } from '@/domain/usecases';

import { DbLoadSurveys } from '@/data/usecases';
import { SurveyMongoRepository } from '@/infra/db';

export const makeDbLoadSurvey = (): LoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadSurveys(surveyMongoRepository);
};

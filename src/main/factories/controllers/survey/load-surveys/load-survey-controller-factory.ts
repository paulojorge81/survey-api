import type { Controller } from '@/presentation/protocols';

import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeDbLoadSurvey } from '@/main/factories/usecases/survey/load-surveys/db-load-survey-factory';
import { LoadSurveysController } from '@/presentation/controllers/survey/load-surveys/load-surveys-controller';

export const makeLoadSurveyController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurvey());
  return makeLogControllerDecorator(controller);
};

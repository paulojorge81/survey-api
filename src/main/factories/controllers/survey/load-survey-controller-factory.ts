import type { Controller } from '@/presentation/protocols';

import { makeLogControllerDecorator } from '@/main/factories/decorators';
import { makeDbLoadSurvey } from '@/main/factories/usecases';
import { LoadSurveysController } from '@/presentation/controllers';

export const makeLoadSurveyController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurvey());
  return makeLogControllerDecorator(controller);
};

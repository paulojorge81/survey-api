import type { Controller } from '@/presentation/protocols';

import { makeAddSurveyValidation } from '@/main/factories/controllers';
import { makeLogControllerDecorator } from '@/main/factories/decorators';
import { makeDbAddSurvey } from '@/main/factories/usecases';
import { AddSurveyController } from '@/presentation/controllers';

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey());
  return makeLogControllerDecorator(controller);
};

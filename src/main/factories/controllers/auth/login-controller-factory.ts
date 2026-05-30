import type { Controller } from '@/presentation/protocols';

import { makeLoginValidation } from '@/main/factories/controllers';
import { makeLogControllerDecorator } from '@/main/factories/decorators';
import { makeDbAuthentication } from '@/main/factories/usecases';
import { LoginController } from '@/presentation/controllers';

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeDbAuthentication(), makeLoginValidation());
  return makeLogControllerDecorator(controller);
};

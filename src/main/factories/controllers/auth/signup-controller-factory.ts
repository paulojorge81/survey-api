import type { Controller } from '@/presentation/protocols';

import { makeSignUpValidation } from '@/main/factories/controllers';
import { makeLogControllerDecorator } from '@/main/factories/decorators';
import { makeDbAddAccount, makeDbAuthentication } from '@/main/factories/usecases';
import { SignUpController } from '@/presentation/controllers';

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication());
  return makeLogControllerDecorator(controller);
};

import type { Controller } from '@/presentation/protocols';

import { makeSignUpValidation } from '@/main/factories/controllers/auth/signup/signup-validation-factory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeDbAddAccount } from '@/main/factories/usecases/account/add-account/db-add-account-factory';
import { makeDbAuthentication } from '@/main/factories/usecases/account/authentication/db-authentication-factory';
import { SignUpController } from '@/presentation/controllers/auth/signup/signup-controller';

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication());
  return makeLogControllerDecorator(controller);
};

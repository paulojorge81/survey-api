import type { Controller } from '@/presentation/protocols';

import { makeLoginValidation } from '@/main/factories/controllers/auth/login/login-validation-factory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeDbAuthentication } from '@/main/factories/usecases/account/authentication/db-authentication-factory';
import { LoginController } from '@/presentation/controllers/auth/login/login-controller';

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeDbAuthentication(), makeLoginValidation());
  return makeLogControllerDecorator(controller);
};

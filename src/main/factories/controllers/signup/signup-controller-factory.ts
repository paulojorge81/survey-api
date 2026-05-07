import { SignUpController } from '@/presentation/controllers/auth/signup/signup-controller';
import type { Controller } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeDbAddAccount } from '@/main/factories/usecases/add-account/db-add-account-factory';
import { makeDbAuthentication } from '@/main/factories/usecases/authentication/db-authentication-factory';
import { makeSignUpValidation } from '@/main/factories/controllers/signup/signup-validation-factory';

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication());
  return makeLogControllerDecorator(controller);
};

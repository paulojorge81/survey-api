import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter';
import type { Validation } from '../../../../presentation/protocols/validation';
import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '../../../../validation/validators';

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  const emailValidator = new EmailValidatorAdapter();
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'));
  validations.push(new EmailValidation('email', emailValidator));
  return new ValidationComposite(validations);
};

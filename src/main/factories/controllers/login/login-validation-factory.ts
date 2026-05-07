import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter';
import type { Validation } from '@/presentation/protocols/validation';
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators';

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  const emailValidator = new EmailValidatorAdapter();
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(new EmailValidation('email', emailValidator));
  return new ValidationComposite(validations);
};

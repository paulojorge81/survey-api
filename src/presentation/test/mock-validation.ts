import type { Validation } from '@/presentation/protocols';

export const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }

  return new ValidationStub();
};

export class ValidationSpy implements Validation {
  error: Error | null = null;
  input: any;

  validate(input: any): Error | null {
    this.input = input;
    return this.error;
  }
}

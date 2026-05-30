import { faker } from '@faker-js/faker';

import type { AccountModel } from '@/domain/models/account';
import type { AddAccount } from '@/domain/usecases';
import type { AuthenticationParams } from '@/domain/usecases/authentication';

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});

export const mockAddAccountParams = (): AddAccount.Params => ({
  name: faker.person.firstName(),
  ...mockAuthenticationParams(),
});

export const mockAccountModel = (): AccountModel => ({
  id: faker.string.uuid(),
  ...mockAddAccountParams(),
});

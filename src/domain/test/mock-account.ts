import { faker } from '@faker-js/faker';

import type { AccountModel } from '@/domain/models/account';
import type { AddAccountParams } from '@/domain/usecases/account/add-account';
import type { AuthenticationParams } from '@/domain/usecases/account/authentication';

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});

export const mockAddAccountParams = (): AddAccountParams => ({
  name: faker.person.firstName(),
  ...mockAuthenticationParams(),
});

export const mockAccountModel = (): AccountModel => ({
  id: faker.string.uuid(),
  ...mockAddAccountParams(),
});

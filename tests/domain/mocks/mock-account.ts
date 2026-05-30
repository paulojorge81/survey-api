import { faker } from '@faker-js/faker';

import type { AccountModel } from '@/domain/models/account';
import type { AddAccount, Authentication } from '@/domain/usecases';

export const mockAuthenticationParams = (): Authentication.Params => ({
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

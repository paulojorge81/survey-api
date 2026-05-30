import { faker } from '@faker-js/faker';

import type { AccountModel } from '@/domain/models/account';
import type { AuthenticationModel } from '@/domain/models/authentication';
import type { AddAccount } from '@/domain/usecases/add-account';
import type { Authentication, AuthenticationParams } from '@/domain/usecases/authentication';
import type { LoadAccountByToken } from '@/domain/usecases/load-account-by-token';

import { mockAccountModel } from '@/tests/domain/mocks';

export class AddAccountSpy implements AddAccount {
  isValid = true;
  addAccountParams!: AddAccount.Params;

  async add(account: AddAccount.Params): Promise<AddAccount.Result | null> {
    this.addAccountParams = account;
    return await Promise.resolve(this.isValid);
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationParams!: AuthenticationParams;
  token = faker.string.uuid();
  name = faker.person.firstName();
  isValid = true;

  async auth(authenticationParams: AuthenticationParams): Promise<AuthenticationModel | null> {
    this.authenticationParams = authenticationParams;
    return this.isValid
      ? await Promise.resolve({ accessToken: this.token, name: this.name })
      : await Promise.resolve(null);
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accountModel: AccountModel | null = mockAccountModel();
  accessToken!: string;
  role!: string;

  async load(accessToken: string, role?: string): Promise<AccountModel | null> {
    this.accessToken = accessToken;
    this.role = role ?? '';
    return await Promise.resolve(this.accountModel);
  }
}

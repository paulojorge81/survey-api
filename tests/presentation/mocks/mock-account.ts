/* eslint-disable @typescript-eslint/no-unsafe-return */
import { faker } from '@faker-js/faker';

import type { AccountModel } from '@/domain/models/account';
import type { AuthenticationModel } from '@/domain/models/authentication';
import type { AddAccount, AddAccountParams } from '@/domain/usecases/add-account';
import type { Authentication, AuthenticationParams } from '@/domain/usecases/authentication';
import type { LoadAccountByToken } from '@/domain/usecases/load-account-by-token';

import { mockAccountModel } from '@/tests/domain/mocks';

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountParams): Promise<AccountModel | null> {
      const fakeAccount = mockAccountModel();
      return await Promise.resolve(fakeAccount);
    }
  }

  return new AddAccountStub();
};

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationParams): Promise<AuthenticationModel> {
      return await Promise.resolve({ accessToken: 'any_token', name: 'any_name' });
    }
  }

  return new AuthenticationStub();
};

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel | null> {
      return await Promise.resolve(mockAccountModel());
    }
  }

  return new LoadAccountByTokenStub();
};

export class AddAccountSpy implements AddAccount {
  accountModel: AccountModel | null = mockAccountModel();
  addAccountParams!: AddAccountParams;

  async add(account: AddAccountParams): Promise<AccountModel | null> {
    this.addAccountParams = account;
    return await Promise.resolve(this.accountModel);
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

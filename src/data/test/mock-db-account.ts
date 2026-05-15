import type { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository';
import type { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';
import type { UpdateAccessTokenRepository } from '@/data/usecases/account/authentication/db-authentication-protocols';
import type { LoadAccountByTokenRepository } from '@/data/usecases/account/load-account-by-token/db-load-account-by-token-protocols';
import type { AccountModel } from '@/domain/models/account';
import type { AddAccountParams } from '@/domain/usecases/account/add-account';

import { mockAccountModel } from '@/domain/test';

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub {
    async add(accountData: AddAccountParams): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel());
    }
  }
  return new AddAccountRepositoryStub();
};

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositorySub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel | null> {
      return await Promise.resolve(mockAccountModel());
    }
  }

  return new LoadAccountByEmailRepositorySub();
};

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken(token: string, role?: string): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel());
    }
  }

  return new LoadAccountByTokenRepositoryStub();
};

export const mockUpdateAccessTokenReporitory = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(id: string, token: string): Promise<void> {
      await Promise.resolve();
    }
  }

  return new UpdateAccessTokenRepositoryStub();
};

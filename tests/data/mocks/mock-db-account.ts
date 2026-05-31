import { faker } from '@faker-js/faker';

import type {
  CheckAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository,
} from '@/data/protocols';
import type { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository';
import type { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';

export class AddAccountRepositorySpy implements AddAccountRepository {
  result = true;
  addAccountParams!: AddAccountRepository.Params;

  async add(data: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    this.addAccountParams = data;
    return await Promise.resolve(this.result);
  }
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  result: LoadAccountByEmailRepository.Result | null = {
    id: faker.string.uuid(),
    name: faker.person.firstName(),
    password: faker.internet.password(),
  };
  email!: string;

  async loadByEmail(email: string): Promise<LoadAccountByEmailRepository.Result | null> {
    this.email = email;
    return await Promise.resolve(this.result);
  }
}

export class CheckAccountByEmailRepositorySpy implements CheckAccountByEmailRepository {
  result: CheckAccountByEmailRepository.Result = false;
  email!: string;

  async checkByEmail(email: string): Promise<CheckAccountByEmailRepository.Result> {
    this.email = email;
    return await Promise.resolve(this.result);
  }
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
  result: LoadAccountByTokenRepository.Result | null = {
    id: faker.string.uuid(),
  };
  token!: string;
  role!: string;

  async loadByToken(token: string, role?: string): Promise<LoadAccountByTokenRepository.Result | null> {
    this.token = token;
    this.role = role ?? '';
    return await Promise.resolve(this.result);
  }
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
  id!: string;
  token!: string;

  async updateAccessToken(id: string, token: string): Promise<void> {
    this.id = id;
    this.token = token;
    await Promise.resolve();
  }
}

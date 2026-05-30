import type { AddAccountRepository, Hasher, LoadAccountByEmailRepository } from '@/data/protocols';
import type { AccountModel } from '@/domain/models/account';
import type { AddAccount, AddAccountParams } from '@/domain/usecases';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
  ) {}
  async add(accountData: AddAccountParams): Promise<AccountModel | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email);
    if (!account) {
      const hashedPassword = await this.hasher.hash(accountData.password);
      const newAccount: AccountModel = await this.addAccountRepository.add({
        ...accountData,
        password: hashedPassword,
      });
      return newAccount;
    }
    return null;
  }
}

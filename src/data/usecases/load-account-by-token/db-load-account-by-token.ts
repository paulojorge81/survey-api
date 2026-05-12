import type { LoadAccountByToken } from '@/domain/usecases/load-account-by-token';
import type { AccountModel } from '@/data/usecases/add-account/db-add-account-protocols';
import type { Decrypter } from '@/data/protocols/criptography/decrypter';
import type { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
  ) {}

  async load(accessToken: string, role?: string): Promise<AccountModel | null> {
    const token = await this.decrypter.decrypt(accessToken);
    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role);
      if (account) return account;
    }
    return null;
  }
}

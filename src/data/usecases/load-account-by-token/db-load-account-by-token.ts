import type { LoadAccountByToken } from '@/domain/usecases/load-account-by-token';
import type { AccountModel } from '../add-account/db-add-account-protocols';
import type { Decrypter } from '@/data/protocols/criptography/decrypter';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(private readonly decrypter: Decrypter) {}

  async load(accessToken: string, role?: string): Promise<AccountModel | null> {
    await this.decrypter.decrypt(accessToken);
    return await Promise.resolve(null);
  }
}

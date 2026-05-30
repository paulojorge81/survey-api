import type { AccountModel } from '@/domain/models/account';
import type { AddAccountParams } from '@/domain/usecases';

export interface AddAccountRepository {
  add: (accountData: AddAccountParams) => Promise<AccountModel>;
}

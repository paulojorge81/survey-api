import type { AccountModel } from '@/domain/models';

export interface AddAccount {
  add: (account: AddAccount.Params) => Promise<AddAccount.Result | null>;
}

export namespace AddAccount {
  export type Params = Omit<AccountModel, 'id'>;
  export type Result = boolean;
}

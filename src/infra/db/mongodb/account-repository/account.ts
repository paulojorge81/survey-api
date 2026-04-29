import type { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository';
import type { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository';
import type { AccountModel } from '../../../../domain/models/account';
import type { AddAccountModel } from '../../../../domain/usecases/add-account';
import { type AccountMongoModel, MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const accountToInsert = { ...accountData };
    const { insertedId } = await accountCollection.insertOne(accountToInsert);
    return {
      id: insertedId.toHexString(),
      ...accountData,
    };
  }

  async loadByEmail(email: string): Promise<AccountModel | null> {
    const accountColletion = await MongoHelper.getCollection('accounts');
    const account = await accountColletion.findOne<AccountMongoModel>({ email });
    if (!account) return null;

    return MongoHelper.mapAccountModel(account);
  }
}

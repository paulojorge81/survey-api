import { ObjectId } from 'mongodb';

import type {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository,
} from '@/data/protocols';
import type { AccountModel } from '@/domain/models';

import { type AccountMongoModel, MongoHelper } from '@/infra/db';

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    LoadAccountByTokenRepository
{
  async add(accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const accountToInsert = { ...accountData };
    const { insertedId } = await accountCollection.insertOne(accountToInsert);
    return {
      id: insertedId.toHexString(),
      ...accountData,
    };
  }

  async loadByEmail(email: string): Promise<AccountModel | null> {
    const accountColletion = await MongoHelper.getCollection<AccountMongoModel>('accounts');
    const account = await accountColletion.findOne({ email });
    if (!account) return null;

    return MongoHelper.mapModel(account);
  }

  async loadByToken(token: string, role?: string): Promise<AccountModel | null> {
    const accountColletion = await MongoHelper.getCollection<AccountMongoModel>('accounts');
    const account = await accountColletion.findOne({
      accessToken: token,
      $or: [{ role }, { role: 'admin' }],
    });
    if (!account) return null;

    return MongoHelper.mapModel(account);
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountColletion = await MongoHelper.getCollection('accounts');
    await accountColletion.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          accessToken: token,
        },
      },
    );
  }
}

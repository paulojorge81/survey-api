/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ObjectId } from 'mongodb';

import type {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  CheckAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository,
} from '@/data/protocols';

import { type AccountMongoModel, MongoHelper } from '@/infra/db';

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    LoadAccountByTokenRepository,
    CheckAccountByEmailRepository
{
  async add(accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const accountToInsert = { ...accountData };
    const result = await accountCollection.insertOne(accountToInsert);
    return !!result.insertedId;
  }

  async checkByEmail(email: string): Promise<CheckAccountByEmailRepository.Result> {
    const accountColletion = await MongoHelper.getCollection<AccountMongoModel>('accounts');
    const account = await accountColletion.findOne({ email }, { projection: { _id: 1 } });
    return account !== null;
  }

  async loadByEmail(email: string): Promise<LoadAccountByEmailRepository.Result | null> {
    const accountColletion = await MongoHelper.getCollection<AccountMongoModel>('accounts');
    const account = await accountColletion.findOne({ email }, { projection: { _id: 1, name: 1, password: 1 } });
    if (!account) return null;

    return MongoHelper.mapModel(account);
  }

  async loadByToken(token: string, role?: string): Promise<LoadAccountByTokenRepository.Result | null> {
    const accountColletion = await MongoHelper.getCollection<AccountMongoModel>('accounts');
    const account = await accountColletion.findOne(
      {
        accessToken: token,
        $or: [{ role }, { role: 'admin' }],
      },
      { projection: { _id: 1 } },
    );
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

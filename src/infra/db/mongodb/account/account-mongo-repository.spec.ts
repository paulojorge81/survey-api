import type { Collection } from 'mongodb';

import { mockAddAccountParams, mockAddAccountWithTokenParams } from '@/domain/test';
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';

const makeSut = (): AccountMongoRepository => new AccountMongoRepository();

// eslint-disable-next-line @typescript-eslint/init-declarations
let accountCollection!: Collection;

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    if (!process.env.MONGO_URL) {
      throw new Error('MONGO_URL not defined');
    }
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany();
  });

  test('Should return an account on add success', async () => {
    const sut = makeSut();
    const accountData = mockAddAccountParams();
    const account = await sut.add(accountData);
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe(accountData.name);
    expect(account.email).toBe(accountData.email);
    expect(account.password).toBe(accountData.password);
  });

  test('Should return an account on laodByEmail success', async () => {
    const sut = makeSut();
    const accountData = mockAddAccountParams();
    await accountCollection.insertOne(accountData);
    const account = await sut.loadByEmail('any_email@mail.com');
    expect(account).toBeTruthy();
    expect(account?.id).toBeTruthy();
    expect(account?.name).toBe(accountData.name);
    expect(account?.email).toBe(accountData.email);
    expect(account?.password).toBe(accountData.password);
  });

  test('Should return an null if laodByEmail fails', async () => {
    const sut = makeSut();
    const account = await sut.loadByEmail('any_email@mail.com');
    expect(account).toBeFalsy();
  });

  test('Should udpate the account accessToken on updateAccessToken success', async () => {
    const sut = makeSut();
    const accountData = mockAddAccountParams();
    const { insertedId } = await accountCollection.insertOne(accountData);
    let account = await accountCollection.findOne({ _id: insertedId });
    expect(account?.accessToken).toBeFalsy();
    await sut.updateAccessToken(insertedId.toHexString(), 'any_token');
    account = await accountCollection.findOne({ _id: insertedId });
    expect(account).toBeTruthy();
    expect(account?.accessToken).toBe('any_token');
  });

  test('Should return an account on loadByToken without role', async () => {
    const sut = makeSut();
    const accountData = mockAddAccountWithTokenParams();
    await accountCollection.insertOne(accountData);
    const account = await sut.loadByToken('any_token');
    expect(account).toBeTruthy();
    expect(account?.id).toBeTruthy();
    expect(account?.name).toBe(accountData.name);
    expect(account?.email).toBe(accountData.email);
    expect(account?.password).toBe(accountData.password);
  });

  test('Should return an account on loadByToken with admin role', async () => {
    const sut = makeSut();
    const accountData = {
      ...mockAddAccountWithTokenParams(),
      role: 'admin',
    };
    await accountCollection.insertOne(accountData);
    const account = await sut.loadByToken('any_token', 'admin');
    expect(account).toBeTruthy();
    expect(account?.id).toBeTruthy();
    expect(account?.name).toBe(accountData.name);
    expect(account?.email).toBe(accountData.email);
    expect(account?.password).toBe(accountData.password);
  });

  test('Should return an account on loadByToken if user is admin', async () => {
    const sut = makeSut();
    const accountData = {
      ...mockAddAccountWithTokenParams(),
      role: 'admin',
    };
    await accountCollection.insertOne(accountData);
    const account = await sut.loadByToken('any_token');
    expect(account).toBeTruthy();
    expect(account?.id).toBeTruthy();
    expect(account?.name).toBe(accountData.name);
    expect(account?.email).toBe(accountData.email);
    expect(account?.password).toBe(accountData.password);
  });

  test('Should return null on loadByToken with invalid role', async () => {
    const sut = makeSut();
    const accountData = {
      ...mockAddAccountWithTokenParams(),
      role: 'any_role',
    };
    await accountCollection.insertOne(accountData);
    const account = await sut.loadByToken('any_token', 'admin');
    expect(account).toBeFalsy();
  });

  test('Should return null if loadByToken fails', async () => {
    const sut = makeSut();
    const account = await sut.loadByToken('any_token');
    expect(account).toBeFalsy();
  });
});

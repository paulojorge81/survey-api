import type { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account-mongo-repository';

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
    const accountData = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    };
    const account = await sut.add(accountData);
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe(accountData.name);
    expect(account.email).toBe(accountData.email);
    expect(account.password).toBe(accountData.password);
  });

  test('Should return an account on laodByEmail success', async () => {
    const sut = makeSut();
    const accountData = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    };
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
    const accountData = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    };
    const { insertedId } = await accountCollection.insertOne(accountData);
    let account = await accountCollection.findOne({ _id: insertedId });
    expect(account?.accessToken).toBeFalsy();
    await sut.updateAccessToken(insertedId.toHexString(), 'any_token');
    account = await accountCollection.findOne({ _id: insertedId });
    expect(account).toBeTruthy();
    expect(account?.accessToken).toBe('any_token');
  });
});

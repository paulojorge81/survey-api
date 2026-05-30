import type { Collection } from 'mongodb';

import { faker } from '@faker-js/faker';

import { AccountMongoRepository } from '@/infra/db/mongodb/account-mongo-repository';
import { MongoHelper } from '@/infra/db/mongodb/mongo-helper';
import { mockAddAccountParams } from '@/tests/domain/mocks';

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

  describe('add()', () => {
    test('Should return an account on success', async () => {
      const sut = makeSut();
      const addAccountParams = mockAddAccountParams();
      const account = await sut.add(addAccountParams);
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(addAccountParams.name);
      expect(account.email).toBe(addAccountParams.email);
      expect(account.password).toBe(addAccountParams.password);
    });
  });

  describe('loadByEmail()', () => {
    test('Should return an account loadByEmail on success', async () => {
      const sut = makeSut();
      const addAccountParams = mockAddAccountParams();
      await accountCollection.insertOne(addAccountParams);
      const account = await sut.loadByEmail(addAccountParams.email);
      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
      expect(account?.name).toBe(addAccountParams.name);
      expect(account?.email).toBe(addAccountParams.email);
      expect(account?.password).toBe(addAccountParams.password);
    });

    test('Should return an null if loadByEmail fails', async () => {
      const sut = makeSut();

      const account = await sut.loadByEmail(faker.internet.email());
      expect(account).toBeFalsy();
    });
  });

  describe('updateAccessToken()', () => {
    test('Should udpate the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut();
      const { insertedId } = await accountCollection.insertOne(mockAddAccountParams());
      let fakeAccount = await accountCollection.findOne({ _id: insertedId });
      expect(fakeAccount?.accessToken).toBeFalsy();

      const accessToken = faker.string.uuid();
      await sut.updateAccessToken(insertedId.toHexString(), accessToken);
      fakeAccount = await accountCollection.findOne({ _id: insertedId });
      expect(fakeAccount).toBeTruthy();
      expect(fakeAccount?.accessToken).toBe(accessToken);
    });
  });

  describe('loadByToken()', () => {
    let name = '';
    let email = '';
    let password = '';
    let accessToken = '';

    beforeEach(() => {
      name = faker.person.firstName();
      email = faker.internet.email();
      password = faker.internet.password();
      accessToken = faker.string.uuid();
    });

    test('Should return an account on loadByToken without role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
      });
      const account = await sut.loadByToken(accessToken);
      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
      expect(account?.name).toBe(name);
      expect(account?.email).toBe(email);
      expect(account?.password).toBe(password);
    });

    test('Should return an account on loadByToken with admin role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
        role: 'admin',
      });
      const account = await sut.loadByToken(accessToken, 'admin');
      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
      expect(account?.name).toBe(name);
      expect(account?.email).toBe(email);
      expect(account?.password).toBe(password);
    });

    test('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
      });
      const account = await sut.loadByToken(accessToken, 'admin');
      expect(account).toBeFalsy();
    });

    test('Should return an account on loadByToken if user is admin', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
        role: 'admin',
      });
      const account = await sut.loadByToken(accessToken);
      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
      expect(account?.name).toBe(name);
      expect(account?.email).toBe(email);
      expect(account?.password).toBe(password);
    });

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByToken(accessToken);
      expect(account).toBeFalsy();
    });
  });
});

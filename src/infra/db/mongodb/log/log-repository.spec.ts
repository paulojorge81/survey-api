/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { LogMongoRepository } from './log-repository';

const makeSut = (): LogMongoRepository => new LogMongoRepository();

describe('Log Mongo Repository', () => {
  let errorCollection = null as Collection | null;
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
    errorCollection = await MongoHelper.getCollection('errors');
    await errorCollection.deleteMany();
  });

  test('Should craete an error log on success', async () => {
    const sut = makeSut();
    await sut.logError('any_error');
    const count = await errorCollection?.countDocuments();
    expect(count).toBe(1);
  });
});

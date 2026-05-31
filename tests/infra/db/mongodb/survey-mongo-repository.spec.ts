/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { Collection } from 'mongodb';

import FakeObjectId from 'bson-objectid';

import { MongoHelper, type SurveyMongoModel } from '@/infra/db/mongodb/mongo-helper';
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-mongo-repository';
import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks';

const makeSut = (): SurveyMongoRepository => new SurveyMongoRepository();

let surveyCollection!: Collection;
let surveyResultCollection!: Collection;
let accountCollection!: Collection;

const makeAccountId = async (): Promise<string> => {
  const res = await accountCollection.insertOne(mockAddAccountParams());
  return res.insertedId.toHexString();
};

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
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany();
    surveyResultCollection = await MongoHelper.getCollection('surveyResults');
    await surveyResultCollection.deleteMany();
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany();
  });

  describe('add()', () => {
    test('Should add a survey on add success', async () => {
      const sut = makeSut();
      await sut.add(mockAddSurveyParams());
      const count = await surveyCollection.countDocuments();
      expect(count).toBe(1);
    });
  });

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      const accountId = await makeAccountId();
      const addSurveyModels = [mockAddSurveyParams(), mockAddSurveyParams()];
      const result = await surveyCollection.insertMany(addSurveyModels);
      const survey = await surveyCollection.findOne<SurveyMongoModel>({
        _id: result.insertedIds[0],
      });

      await surveyResultCollection.insertOne({
        surveyId: survey?._id,
        accountId,
        answer: survey?.answers[0].answer,
        date: new Date(),
      });
      const sut = makeSut();
      const surveys = await sut.loadAll(accountId);
      expect(surveys.length).toBe(2);
      expect(surveys[0].id).toBeTruthy();
      expect(surveys[0].question).toBe(addSurveyModels[0].question);
      expect(surveys[0].didAnswer).toBe(true);
      expect(surveys[1].question).toBe(addSurveyModels[1].question);
      expect(surveys[1].didAnswer).toBe(false);
    });

    test('Should load empty list', async () => {
      const accountId = await makeAccountId();
      const sut = makeSut();
      const surveys = await sut.loadAll(accountId);
      expect(surveys.length).toBe(0);
    });
  });

  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const sut = makeSut();
      const res = await surveyCollection.insertOne(mockAddSurveyParams());
      const survey = await sut.loadById(res.insertedId.toHexString());
      expect(survey).toBeTruthy();
      expect(survey?.id).toBeTruthy();
    });
  });

  describe('checkById()', () => {
    test('Should return true if survey exists', async () => {
      const sut = makeSut();
      const res = await surveyCollection.insertOne(mockAddSurveyParams());
      const exists = await sut.checkById(res.insertedId.toHexString());
      expect(exists).toBe(true);
    });

    test('Should return true if survey exists', async () => {
      const sut = makeSut();
      const id = FakeObjectId();
      const exists = await sut.checkById(id.toHexString());
      expect(exists).toBe(false);
    });
  });
});

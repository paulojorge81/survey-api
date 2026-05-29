/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/init-declarations */

import { ObjectId, type Collection } from 'mongodb';

import type { AccountModel } from '@/domain/models/account';
import type { SurveyModel } from '@/domain/models/surveys';

import { mockAddAccountParams, mockAddSurveyParams } from '@/domain/test';
import { type AccountMongoModel, MongoHelper, type SurveyMongoModel } from '@/infra/db/mongodb/helpers/mongo-helper';
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository';

let surveyCollection!: Collection;
let surveyResultCollection!: Collection;
let accountCollection!: Collection;

const makeSurvey = async (): Promise<SurveyModel | null> => {
  const res = await surveyCollection.insertOne(mockAddSurveyParams());
  const survey = await surveyCollection.findOne<SurveyMongoModel>({ _id: res.insertedId });
  if (!survey) return null;
  return MongoHelper.mapModel(survey);
};

const makeAccount = async (): Promise<AccountModel | null> => {
  const res = await accountCollection.insertOne(mockAddAccountParams());
  const account = await accountCollection.findOne<AccountMongoModel>({ _id: res.insertedId });
  if (!account) return null;
  return MongoHelper.mapModel(account);
};

const makeSut = (): SurveyResultMongoRepository => new SurveyResultMongoRepository();

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

  describe('save()', () => {
    test('Should add a survey result if its new', async () => {
      const survey = await makeSurvey();
      const account = await makeAccount();
      const sut = makeSut();
      await sut.save({
        surveyId: survey!.id,
        accountId: account!.id,
        answer: survey!.answers[0].answer,
        date: new Date(),
      });
      const surveyResult = await surveyResultCollection.findOne({
        surveyId: new ObjectId(survey!.id),
        accountId: new ObjectId(account!.id),
      });
      expect(surveyResult).toBeTruthy();
    });

    test('Should update survey result if its not new', async () => {
      const survey = await makeSurvey();
      const account = await makeAccount();
      const sut = makeSut();
      const surveyData = {
        surveyId: survey!.id,
        accountId: account!.id,
        date: new Date(),
      };
      await surveyResultCollection.insertOne({
        ...surveyData,
        answer: survey!.answers[0].answer,
      });

      await sut.save({ ...surveyData, answer: survey!.answers[1].answer });
      const surveyResult = await surveyResultCollection
        .find({
          surveyId: new ObjectId(survey!.id),
          accountId: new ObjectId(account!.id),
        })
        .toArray();
      expect(surveyResult).toBeTruthy();
      expect(surveyResult.length).toBe(1);
    });
  });

  describe('loadBySurveyId()', () => {
    test('Should load survey result', async () => {
      const survey = await makeSurvey();
      const account = await makeAccount();
      const account2 = await makeAccount();
      const surveyData = {
        surveyId: new ObjectId(survey!.id),
        answer: survey!.answers[0].answer,
        date: new Date(),
      };

      await surveyResultCollection.insertMany([
        { ...surveyData, accountId: new ObjectId(account!.id) },
        { ...surveyData, accountId: new ObjectId(account2!.id) },
      ]);
      const sut = makeSut();
      const surveyResult = await sut.loadBySurveyId(survey!.id, account!.id);

      expect(surveyResult).toBeTruthy();
      expect(surveyResult?.surveyId).toEqual(new ObjectId(survey!.id));
      expect(surveyResult?.answers[0].count).toBe(2);
      expect(surveyResult?.answers[0].percent).toBe(100);
      expect(surveyResult?.answers[0].isCurrentAccountAnswer).toBe(true);
      expect(surveyResult?.answers[1].count).toBe(0);
      expect(surveyResult?.answers[1].percent).toBe(0);
      expect(surveyResult?.answers[1].isCurrentAccountAnswer).toBe(false);
    });

    test('Should load survey result 2', async () => {
      const survey = await makeSurvey();
      const account = await makeAccount();
      const account2 = await makeAccount();
      const account3 = await makeAccount();
      const surveyData = {
        surveyId: new ObjectId(survey!.id),
        date: new Date(),
      };

      await surveyResultCollection.insertMany([
        { ...surveyData, answer: survey!.answers[0].answer, accountId: new ObjectId(account!.id) },
        { ...surveyData, answer: survey!.answers[1].answer, accountId: new ObjectId(account2!.id) },
        { ...surveyData, answer: survey!.answers[1].answer, accountId: new ObjectId(account3!.id) },
      ]);
      const sut = makeSut();
      const surveyResult = await sut.loadBySurveyId(survey!.id, account2!.id);

      expect(surveyResult).toBeTruthy();
      expect(surveyResult?.surveyId).toEqual(new ObjectId(survey!.id));
      expect(surveyResult?.answers[0].count).toBe(2);
      expect(surveyResult?.answers[0].percent).toBe(67);
      expect(surveyResult?.answers[0].isCurrentAccountAnswer).toBe(true);
      expect(surveyResult?.answers[1].count).toBe(1);
      expect(surveyResult?.answers[1].percent).toBe(33);
      expect(surveyResult?.answers[1].isCurrentAccountAnswer).toBe(false);
    });

    test('Should load survey result 3', async () => {
      const survey = await makeSurvey();
      const account = await makeAccount();
      const account2 = await makeAccount();
      const account3 = await makeAccount();
      const surveyData = {
        surveyId: new ObjectId(survey!.id),
        date: new Date(),
      };

      await surveyResultCollection.insertMany([
        { ...surveyData, answer: survey!.answers[0].answer, accountId: new ObjectId(account!.id) },
        { ...surveyData, answer: survey!.answers[1].answer, accountId: new ObjectId(account2!.id) },
      ]);
      const sut = makeSut();
      const surveyResult = await sut.loadBySurveyId(survey!.id, account3!.id);

      expect(surveyResult).toBeTruthy();
      expect(surveyResult?.surveyId).toEqual(new ObjectId(survey!.id));
      expect(surveyResult?.answers[0].count).toBe(1);
      expect(surveyResult?.answers[0].percent).toBe(50);
      expect(surveyResult?.answers[0].isCurrentAccountAnswer).toBe(false);
      expect(surveyResult?.answers[1].count).toBe(1);
      expect(surveyResult?.answers[1].percent).toBe(50);
      expect(surveyResult?.answers[1].isCurrentAccountAnswer).toBe(false);
    });

    test('Should return null if there is no survey result', async () => {
      const account = await makeAccount();
      const survey = await makeSurvey();
      const sut = makeSut();
      const surveyResult = await sut.loadBySurveyId(survey!.id, account!.id);
      expect(surveyResult).toBeNull();
    });
  });
});

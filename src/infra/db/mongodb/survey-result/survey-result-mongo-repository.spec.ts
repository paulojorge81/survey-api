/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/init-declarations */

import type { Collection } from 'mongodb';

import type { AccountModel } from '@/domain/models/account';
import type { SurveyModel } from '@/domain/models/surveys';

import { type AccountMongoModel, MongoHelper, type SurveyMongoModel } from '@/infra/db/mongodb/helpers/mongo-helper';
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository';

let surveyCollection!: Collection;
let surveyResultCollection!: Collection;
let accountCollection!: Collection;

const makeSurvey = async (): Promise<SurveyModel | null> => {
  const res = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer',
      },
      {
        answer: 'other_answer',
      },
    ],
    date: new Date(),
  });
  const survey = await surveyCollection.findOne<SurveyMongoModel>({ _id: res.insertedId });
  if (!survey) return null;
  return MongoHelper.mapModel(survey);
};

const makeAccount = async (): Promise<AccountModel | null> => {
  const res = await surveyCollection.insertOne({
    name: 'any_name',
    email: 'any_email#mail.com',
    password: 'any_password',
  });
  const account = await surveyCollection.findOne<AccountMongoModel>({ _id: res.insertedId });
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
      const surveyData = {
        surveyId: survey!.id,
        accountId: account!.id,
        answer: survey!.answers[0].answer,
        date: new Date(),
      };
      const surveyResult = await sut.save(surveyData);
      await surveyCollection.findOne({ question: 'any_question' });
      expect(surveyResult).toBeTruthy();
      expect(surveyResult.id).toBeTruthy();
      expect(surveyResult.answer).toBe(survey?.answers[0].answer);
    });

    test('Should update survey result if its not new', async () => {
      const survey = await makeSurvey();
      const account = await makeAccount();
      const sut = makeSut();
      const res = await surveyResultCollection.insertOne({
        surveyId: survey!.id,
        accountId: account!.id,
        answer: survey!.answers[0].answer,
        date: new Date(),
      });
      const surveyData = {
        surveyId: survey!.id,
        accountId: account!.id,
        answer: survey!.answers[1].answer,
        date: new Date(),
      };
      const surveyResult = await sut.save(surveyData);
      await surveyCollection.findOne({ question: 'any_question' });
      expect(surveyResult).toBeTruthy();
      expect(surveyResult.id).toEqual(res.insertedId.toHexString());
    });
  });
});

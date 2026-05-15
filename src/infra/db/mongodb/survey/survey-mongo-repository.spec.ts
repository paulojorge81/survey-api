/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { Collection } from 'mongodb';

import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository';

const makeSut = (): SurveyMongoRepository => new SurveyMongoRepository();

// eslint-disable-next-line @typescript-eslint/init-declarations
let surveyCollection!: Collection;

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
  });

  describe('add()', () => {
    test('Should add a survey on add success', async () => {
      const sut = makeSut();
      const surveyData = {
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
      };
      await sut.add(surveyData);
      const survey = await surveyCollection.findOne({ question: 'any_question' });
      expect(survey).toBeTruthy();
    });
  });

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      const sut = makeSut();
      const surveyData = [
        {
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
        },
        {
          question: 'other_question',
          answers: [
            {
              image: 'other_image',
              answer: 'other_answer',
            },
          ],
          date: new Date(),
        },
      ];
      await surveyCollection.insertMany(surveyData);
      const surveys = await sut.loadAll();
      expect(surveys.length).toBe(surveyData.length);
      expect(surveys[0].id).toBeTruthy();
      expect(surveys[0].question).toBe('any_question');
    });

    test('Should load empty list', async () => {
      const sut = makeSut();
      const surveyData = [];
      const surveys = await sut.loadAll();
      expect(surveys.length).toBe(surveyData.length);
    });
  });

  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const sut = makeSut();
      const surveyData = {
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer',
          },
        ],
        date: new Date(),
      };
      const res = await surveyCollection.insertOne(surveyData);
      const survey = await sut.loadById(res.insertedId.toHexString());
      expect(survey).toBeTruthy();
      expect(survey?.id).toBeTruthy();
    });
  });
});

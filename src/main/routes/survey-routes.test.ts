/* eslint-disable @typescript-eslint/init-declarations */

import { ObjectId, type Collection } from 'mongodb';
import request from 'supertest';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { HttpStatusCode } from '@/presentation/http/http-status-code';
import { app } from '@/main/config/app';
import { sign } from 'jsonwebtoken';
import { env } from '../config/env';

let surveyCollection!: Collection;
let accountCollection!: Collection;

describe('Login Routes', () => {
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
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany();
  });

  describe('POST /surveys', () => {
    test('Should return 403 on add surveys without accessToken', async () => {
      const route = '/api/surveys';
      await request(app)
        .post(route)
        .send({
          question: 'Question',
          answers: [
            {
              image: 'http://image-name.com',
              answer: 'answer 1',
            },
            {
              answer: 'answer 2',
            },
          ],
        })
        .expect(HttpStatusCode.FORBIDDEN);
    });

    test('Should return 204 on add surveys with valid accessToken', async () => {
      const res = await accountCollection.insertOne({
        name: 'Paulo',
        email: 'paulo@mail.com',
        password: '123',
        role: 'admin',
      });
      const id = res.insertedId.toHexString();
      const accessToken = sign({ id }, env.JWT_SECRET);
      await accountCollection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: { accessToken },
        },
      );
      const route = '/api/surveys';
      await request(app)
        .post(route)
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [
            {
              image: 'http://image-name.com',
              answer: 'answer 1',
            },
            {
              answer: 'answer 2',
            },
          ],
        })
        .expect(HttpStatusCode.NO_CONTENT);
    });
  });
  describe('GET /surveys', () => {
    test('Should return 403 on load surveys without accessToken', async () => {
      const route = '/api/surveys';
      await request(app).get(route).expect(HttpStatusCode.FORBIDDEN);
    });

    // test('Should return 204 on add surveys with valid accessToken', async () => {
    //   const res = await accountCollection.insertOne({
    //     name: 'Paulo',
    //     email: 'paulo@mail.com',
    //     password: '123',
    //     role: 'admin',
    //   });
    //   const id = res.insertedId.toHexString();
    //   const accessToken = sign({ id }, env.JWT_SECRET);
    //   await accountCollection.updateOne(
    //     {
    //       _id: new ObjectId(id),
    //     },
    //     {
    //       $set: { accessToken },
    //     },
    //   );
    //   const route = '/api/surveys';
    //   await request(app)
    //     .post(route)
    //     .set('x-access-token', accessToken)
    //     .send({
    //       question: 'Question',
    //       answers: [
    //         {
    //           image: 'http://image-name.com',
    //           answer: 'answer 1',
    //         },
    //         {
    //           answer: 'answer 2',
    //         },
    //       ],
    //     })
    //     .expect(HttpStatusCode.NO_CONTENT);
    // });
  });
});

/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { Collection } from 'mongodb';

import { hash } from 'bcrypt';
import request from 'supertest';

import { MongoHelper } from '@/infra/db/mongodb/mongo-helper';
import { makeApp } from '@/main/config/app';
import { HttpStatusCode } from '@/presentation/http/http-status-code';

// eslint-disable-next-line @typescript-eslint/init-declarations
let accountCollection!: Collection;

describe('Auth GraphQL', () => {
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

  describe('Login Query', () => {
    test('Should return an Accout on valid credentials', async () => {
      const salt = 12;
      const password = await hash('123', salt);
      const accountData = {
        name: 'Paulo',
        email: 'paulo@mail.com',
        password,
      };
      await accountCollection.insertOne(accountData);
      const app = await makeApp();
      const response = await request(app)
        .post('/graphql')
        .send({
          query: `
            query {
              login (email: "paulo@mail.com", password: "123") {
                  accessToken
                  name
              }
            }
          `,
        })
        .expect(HttpStatusCode.SUCCESS);

      expect(response.body.data.login.accessToken).toBeTruthy();
      expect(response.body.data.login.name).toBe('Paulo');
    });
  });

  test('Should return UnauthorizedError on invalid credentials', async () => {
    const app = await makeApp();
    const response: any = await request(app)
      .post('/graphql')
      .send({
        query: `
            query {
              login (email: "paulo@mail.com", password: "123") {
                  accessToken
                  name
              }
            }
          `,
      })
      .expect(HttpStatusCode.UNAUTHORIZED);

    expect(response.body.data).toBeFalsy();
    expect(response.body.errors[0].message).toBe('Unauthorized');
  });
});

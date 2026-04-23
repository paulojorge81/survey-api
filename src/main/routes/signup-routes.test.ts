import request from 'supertest';
import { app } from '../config/app';
import { HttpStatusCode } from '../../presentation/http/http-status-code';

describe('SignUp Routes', () => {
  test('Should return an account on success', async () => {
    const route = '/api/signup'
    await request(app).post(route).send({
      name: 'Paulo',
      email: 'paulo@mail.com',
      password: '123',
      passwordConfirmation: '123'
    }).expect(HttpStatusCode.SUCCESS)
  });
});

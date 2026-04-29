import request from 'supertest';
import { app } from '../config/app';

describe('Body Parser Middlewares', () => {
  test('Should parse body as json', async () => {
    const route = '/test_body_parser';
    app.post(route, (req, res) => {
      res.send(req.body);
    });
    await request(app).post(route).send({ name: 'Paulo' }).expect({ name: 'Paulo' });
  });
});

import { AccessDeniedError } from '@/presentation/errors';
import { forbidden } from '@/presentation/helpers/http/http-helper';
import type { HttpRequest } from '@/presentation/protocols';
import { AuthMiddleware } from './auth-middleware';

interface SutType {
  sut: AuthMiddleware;
}

const makeFakeRequest = (): HttpRequest => ({
  headers: {},
});

const makeSut = (): SutType => {
  const sut = new AuthMiddleware();
  return { sut };
};

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });
});

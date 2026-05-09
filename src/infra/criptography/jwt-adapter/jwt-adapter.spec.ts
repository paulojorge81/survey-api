import jwt from 'jsonwebtoken';
import { JwtAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  sign: async (): Promise<string> => await Promise.resolve('any_token'),
  verify: async (): Promise<string> => await Promise.resolve('any_token'),
}));

const makeSut = (): JwtAdapter => {
  const sut = new JwtAdapter('secret');
  return sut;
};

describe('Jwt Adapter', () => {
  test('Should call sign with correct values', async () => {
    const sut = makeSut();
    const signSpy = jest.spyOn(jwt, 'sign');
    await sut.encrypt('any_id');
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
  });

  test('Should return a token on sign success', async () => {
    const sut = makeSut();
    const accessToken = await sut.encrypt('any_id');
    expect(accessToken).toBe('any_token');
  });

  test('Should throws if sign throws', async () => {
    const sut = makeSut();
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.encrypt('any_id');
    await expect(promise).rejects.toThrow();
  });

  test('Should call verify with correct values', async () => {
    const sut = makeSut();
    const verifySpy = jest.spyOn(jwt, 'verify');
    await sut.decrypt('any_token');
    expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret');
  });
});

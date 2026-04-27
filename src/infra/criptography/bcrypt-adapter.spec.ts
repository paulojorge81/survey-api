import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';
import type { Hasher } from '../../data/protocols/criptography/hasher';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return await Promise.resolve('hash');
  },
}));

const SALT = 12;

const makeSut = (): Hasher => {
  const sut = new BcryptAdapter(SALT);
  return sut;
};

describe('Bcrypt Adapter', () => {
  test('Sould call bcrypt with correct values', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.hash('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', SALT);
  });

  test('Sould return a hash on success', async () => {
    const sut = makeSut();
    const hash = await sut.hash('any_value');
    expect(hash).toBe('hash');
  });

  test('Sould throw if bcrypt throws', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.hash('any_value');
    await expect(promise).rejects.toThrow();
  });
});

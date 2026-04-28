/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-void-return */
import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return await Promise.resolve('hash');
  },
  async compare(): Promise<boolean> {
    return await Promise.resolve(true);
  },
}));

const SALT = 12;

const makeSut = (): BcryptAdapter => {
  const sut = new BcryptAdapter(SALT);
  return sut;
};

describe('Bcrypt Adapter', () => {
  test('Sould call hash with correct values', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.hash('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', SALT);
  });

  test('Sould return a valid hash on hash success', async () => {
    const sut = makeSut();
    const hash = await sut.hash('any_value');
    expect(hash).toBe('hash');
  });

  test('Sould throw if hash throws', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.hash('any_value');
    await expect(promise).rejects.toThrow();
  });

  test('Sould call compare with correct values', async () => {
    const sut = makeSut();
    const compareSpy = jest.spyOn(bcrypt, 'compare');
    await sut.compare('any_value', 'any_hash');
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
  });

  test('Sould return true when compare succeeds', async () => {
    const sut = makeSut();
    const isValid = await sut.compare('any_value', 'any_hash');
    expect(isValid).toBe(true);
  });

  test('Sould return false when compare fails', async () => {
    const sut = makeSut();
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementationOnce(async () => await Promise.resolve(false));
    const isValid = await sut.compare('any_value', 'any_hash');
    expect(isValid).toBe(false);
  });
});

import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter';
import type { Encrypter } from '../../data/protocols/encrypter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return await Promise.resolve('hash')
  }
}))

const SALT = 12;

const makeSut = (): Encrypter => {
  const sut = new BcryptAdapter(SALT);
  return sut
}

describe('Bcrypt Adapter', () => {
  test('Sould call bcrypt with correct values', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', SALT)
  });

  test('Sould return a hash on success', async () => {
    const sut = makeSut();
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hash')
  });
});

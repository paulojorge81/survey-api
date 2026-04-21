import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter';
import type { Encrypter } from '../../data/protocols/encrypter';

const makeSut = (): Encrypter => {
  const salt = 12;
  const sut = new BcryptAdapter(salt);
  return sut
}

describe('Bcrypt Adapter', () => {
  test('Sould call bcrypt with correct values', async () => {
    const salt = 12;
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  });
});

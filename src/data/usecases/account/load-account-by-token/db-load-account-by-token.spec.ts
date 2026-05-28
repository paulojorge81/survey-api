/* eslint-disable @typescript-eslint/no-magic-numbers */
import { faker } from '@faker-js/faker';

import { DecrypterSpy, LoadAccountByTokenRepositorySpy } from '@/data/test';
import { DbLoadAccountByToken } from '@/data/usecases/account/load-account-by-token/db-load-account-by-token';
import { throwError } from '@/domain/test';

type SutTypes = {
  sut: DbLoadAccountByToken;
  decrypterSpy: DecrypterSpy;
  loadAccountByTokenRepositorySpy: LoadAccountByTokenRepositorySpy;
};

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy();
  const loadAccountByTokenRepositorySpy = new LoadAccountByTokenRepositorySpy();
  const sut = new DbLoadAccountByToken(decrypterSpy, loadAccountByTokenRepositorySpy);
  return {
    sut,
    decrypterSpy,
    loadAccountByTokenRepositorySpy,
  };
};

let token = '';
let role = '';

describe('DbLoadAccountByToken UseCase', () => {
  beforeEach(() => {
    token = faker.string.uuid();
    role = faker.word.words(1);
  });

  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterSpy } = makeSut();
    await sut.load(token, role);
    expect(decrypterSpy.ciphertext).toBe(token);
  });

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterSpy } = makeSut();
    decrypterSpy.plaintext = null;
    const account = await sut.load(token, role);
    expect(account).toBeNull();
  });

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut();
    await sut.load(token, role);
    expect(loadAccountByTokenRepositorySpy.role).toBe(role);
    expect(loadAccountByTokenRepositorySpy.token).toBe(token);
  });

  test('Should returns null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut();
    loadAccountByTokenRepositorySpy.accountModel = null;
    const account = await sut.load(token, role);
    expect(account).toBeNull();
  });

  test('Should return an account on success', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut();
    const account = await sut.load(token, role);
    expect(account).toEqual(loadAccountByTokenRepositorySpy.accountModel);
  });

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterSpy } = makeSut();
    jest.spyOn(decrypterSpy, 'decrypt').mockImplementationOnce(throwError);
    const account = await sut.load(token, role);
    expect(account).toBeNull();
  });

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut();
    jest.spyOn(loadAccountByTokenRepositorySpy, 'loadByToken').mockImplementationOnce(throwError);
    const promise = sut.load(token, role);
    await expect(promise).rejects.toThrow();
  });
});

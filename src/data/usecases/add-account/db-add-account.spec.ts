import type { Encrypter } from "../../protocols/encrypter";
import { DbAddAccount } from "./db-add-account";

interface SutType {
  sut: DbAddAccount;
  encryptStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncryptStub {
    async encrypt(value: string): Promise<string> {
      return await Promise.resolve("hashed_password")
    }
  }
  return new EncryptStub()
}

const makeSut = (): SutType => {
  const encryptStub = makeEncrypter()
  const sut = new DbAddAccount(encryptStub)
  return {
    sut, encryptStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encryptStub } = makeSut()
    const encryptSpy = jest.spyOn(encryptStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }

    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith("valid_password")
  });
});

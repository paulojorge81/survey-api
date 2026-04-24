import { MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helper";
import { Login } from "./login";

const makeSut = (): Login => {
  const sut = new Login()

  return sut;
}

describe('Login Controller', () => {
  test('Sould return 400 if no email is provided', async () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  });
});

import { HttpStatusCode } from "../../presentation/http/http-status-code";
import type { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";

interface SutType {
  controllerStub: Controller;
  sut: LogControllerDecorator;
}

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse = {
        statusCode: HttpStatusCode.SUCCESS,
        body: {
          name: 'Paulo'
        }
      }
      return await Promise.resolve(httpResponse)
    }
  }

  return new ControllerStub()
}

const makeSut = (): SutType => {
  const controllerStub = makeControllerStub()
  const sut = new LogControllerDecorator(controllerStub)
  return { sut, controllerStub };
}


describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  });
});

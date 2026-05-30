import { faker } from '@faker-js/faker';

import type { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';

import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator';
import { ok, serverError } from '@/presentation/helpers/http-helper';
import { LogErrorRepositorySpy } from '@/tests/data/mocks';
import { mockAccountModel } from '@/tests/domain/mocks';

type SutTypes = {
  sut: LogControllerDecorator;
  controllerSpy: ControllerSpy;
  logErrorRepositorySpy: LogErrorRepositorySpy;
};

class ControllerSpy implements Controller {
  httpResponse = ok(mockAccountModel());
  httpRequest!: HttpRequest;

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    this.httpRequest = httpRequest;
    return await Promise.resolve(this.httpResponse);
  }
}

const mockRequest = (): HttpRequest => {
  const password = faker.internet.password();
  return {
    body: {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password,
      passwordConfirmation: password,
    },
  };
};

const mockServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = 'any_stack';
  return serverError(fakeError);
};

const makeSut = (): SutTypes => {
  const controllerSpy = new ControllerSpy();
  const logErrorRepositorySpy = new LogErrorRepositorySpy();
  const sut = new LogControllerDecorator(controllerSpy, logErrorRepositorySpy);
  return { sut, controllerSpy, logErrorRepositorySpy };
};

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(controllerSpy.httpRequest).toEqual(httpRequest);
  });

  test('Should return the same result of the controller', async () => {
    const { sut, controllerSpy } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(controllerSpy.httpResponse);
  });

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut();
    const serverError = mockServerError();
    controllerSpy.httpResponse = serverError;
    await sut.handle(mockRequest());
    expect(logErrorRepositorySpy.stack).toBe(serverError.body.stack);
  });
});

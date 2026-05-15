import type { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository';
import type { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';

import { mockLogErrorRepositoryStub } from '@/data/test';
import { mockAccountModel } from '@/domain/test';
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator';
import { ServerError } from '@/presentation/errors';
import { ok, serverError } from '@/presentation/helpers/http/http-helper';

type SutTypes = {
  controllerStub: Controller;
  sut: LogControllerDecorator;
  logErrorRepositoryStub: LogErrorRepository;
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve(ok(mockAccountModel()));
    }
  }

  return new ControllerStub();
};

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub();
  const logErrorRepositoryStub = mockLogErrorRepositoryStub();
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub);
  return { sut, controllerStub, logErrorRepositoryStub };
};

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    await sut.handle(makeFakeRequest());
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
  });

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(mockAccountModel()));
  });

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');
    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(serverError(new ServerError('any_stack')));
    await sut.handle(makeFakeRequest());
    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});

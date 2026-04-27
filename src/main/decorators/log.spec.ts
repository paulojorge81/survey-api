import type { LogErrorRepository } from '../../data/protocols/log-error-repository';
import type { AccountModel } from '../../domain/models/account';
import { ServerError } from '../../presentation/errors';
import { ok, serverError } from '../../presentation/helpers/http/http-helper';
import type {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

interface SutType {
  controllerStub: Controller;
  sut: LogControllerDecorator;
  logErrorRepositoryStub: LogErrorRepository;
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
});

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve(ok(makeFakeAccount()));
    }
  }

  return new ControllerStub();
};

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      await Promise.resolve();
    }
  }

  return new LogErrorRepositoryStub();
};

const makeSut = (): SutType => {
  const controllerStub = makeControllerStub();
  const logErrorRepositoryStub = makeLogErrorRepositoryStub();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub,
  );
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
    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');
    jest
      .spyOn(controllerStub, 'handle')
      .mockResolvedValueOnce(serverError(new ServerError('any_stack')));
    await sut.handle(makeFakeRequest());
    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});

import MockDate from 'mockdate';

import { AddSurveyController } from '@/presentation/controllers/survey/add-survey-controller';
import { badRequest, noContent, serverError } from '@/presentation/helpers/http-helper';
import { mockAddSurveyParams, throwError } from '@/tests/domain/mocks';
import { AddSurveySpy, ValidationSpy } from '@/tests/presentation/mocks';

type SutTypes = {
  sut: AddSurveyController;
  validationSpy: ValidationSpy;
  addSurveySpy: AddSurveySpy;
};

const mockRequest = (): AddSurveyController.Request => ({
  ...mockAddSurveyParams(),
});

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const addSurveySpy = new AddSurveySpy();
  const sut = new AddSurveyController(validationSpy, addSurveySpy);
  return {
    sut,
    validationSpy,
    addSurveySpy,
  };
};

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut();
    const request = mockRequest();
    await sut.handle(request);
    expect(validationSpy.input).toEqual(request);
  });

  test('Should return 400 if Validation fails', async () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.error = new Error();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(badRequest(validationSpy.error));
  });

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveySpy } = makeSut();
    const request = mockRequest();
    await sut.handle(request);
    expect(addSurveySpy.addSurveyParams).toEqual(request);
  });

  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveySpy } = makeSut();
    jest.spyOn(addSurveySpy, 'add').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 204 on success', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(noContent());
  });
});

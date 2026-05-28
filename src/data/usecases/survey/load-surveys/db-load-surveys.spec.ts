import { faker } from '@faker-js/faker';
import MockDate from 'mockdate';

import { LoadSurveysRepositorySpy } from '@/data/test';
import { DbLoadSurveys } from '@/data/usecases/survey/load-surveys/db-load-surveys';
import { throwError } from '@/domain/test';

type SutTypes = {
  sut: DbLoadSurveys;
  loadSurveysRepositorySpy: LoadSurveysRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadSurveysRepositorySpy = new LoadSurveysRepositorySpy();
  const sut = new DbLoadSurveys(loadSurveysRepositorySpy);
  return {
    sut,
    loadSurveysRepositorySpy,
  };
};

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    const accountId = faker.string.uuid();
    await sut.load(accountId);
    expect(loadSurveysRepositorySpy.accountId).toBe(accountId);
  });

  test('Should return a list of Surveys on success', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    const surveys = await sut.load(faker.string.uuid());
    expect(surveys).toEqual(loadSurveysRepositorySpy.surveyModels);
  });

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    jest.spyOn(loadSurveysRepositorySpy, 'loadAll').mockImplementationOnce(throwError);
    const promise = sut.load(faker.string.uuid());
    await expect(promise).rejects.toThrow();
  });
});

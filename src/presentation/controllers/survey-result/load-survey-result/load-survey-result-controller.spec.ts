import type {
  HttpRequest,
  LoadSurveyById,
} from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller-protocols';

import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller';
import { mockLoadSurveyById } from '@/presentation/test';

type SutTypes = {
  sut: LoadSurveyResultController;
  loadSurveyByIdStub: LoadSurveyById;
};

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id',
  },
});

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById();
  const sut = new LoadSurveyResultController(loadSurveyByIdStub);
  return {
    sut,
    loadSurveyByIdStub,
  };
};

describe('LoadSurveyResult Controller', () => {
  test('Should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const httpeRequest = makeFakeRequest();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');
    await sut.handle(httpeRequest);
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id');
  });
});

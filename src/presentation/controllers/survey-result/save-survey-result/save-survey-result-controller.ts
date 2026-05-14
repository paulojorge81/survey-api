import { HttpStatusCode } from '@/presentation/http/http-status-code';
import type {
  LoadSurveyById,
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller-protocols';
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper';
import { InvalidParamError } from '@/presentation/errors';

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const {
        params: { surveyId },
        body: { answer },
      } = httpRequest;
      const survey = await this.loadSurveyById.loadById(surveyId);
      if (survey) {
        const answers = survey.answers.map((a) => a.answer);
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'));
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'));
      }
      return await Promise.resolve({ body: {}, statusCode: HttpStatusCode.SUCCESS });
    } catch (error) {
      return serverError(error instanceof Error ? error : new Error('Internal server error'));
    }
  }
}

import { HttpStatusCode } from '@/presentation/http/http-status-code';
import type {
  AddSurvey,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from '@/presentation/controllers/add-survey/add-survey-controller-protocols';
import { badRequest, serverError } from '@/presentation/helpers/http/http-helper';

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }
      const {
        body: { question, answers },
      } = httpRequest;

      await this.addSurvey.add({
        question,
        answers,
      });

      return await Promise.resolve({ body: {}, statusCode: HttpStatusCode.NO_CONTENT });
    } catch (error) {
      return serverError(error instanceof Error ? error : new Error('Internal server error'));
    }
  }
}

import type {
  AddSurvey,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from '@/presentation/controllers/add-survey/add-survey-controller-protocols';
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper';

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

      return noContent();
    } catch (error) {
      return serverError(error instanceof Error ? error : new Error('Internal server error'));
    }
  }
}

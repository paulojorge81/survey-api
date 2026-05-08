import { HttpStatusCode } from '@/presentation/http/http-status-code';
import type {
  AddSurvey,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from '@/presentation/controllers/add-survey/add-survey-controller-protocols';
import { badRequest } from '@/presentation/helpers/http/http-helper';

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
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

    return await Promise.resolve({ body: {}, statusCode: HttpStatusCode.SUCCESS });
  }
}

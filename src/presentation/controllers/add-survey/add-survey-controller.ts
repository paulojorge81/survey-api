import { HttpStatusCode } from '@/presentation/http/http-status-code';
import type {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from '@/presentation/controllers/add-survey/add-survey-controller-protocols';

export class AddSurveyController implements Controller {
  constructor(private readonly validation: Validation) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body);

    return await Promise.resolve({ body: {}, statusCode: HttpStatusCode.SUCCESS });
  }
}

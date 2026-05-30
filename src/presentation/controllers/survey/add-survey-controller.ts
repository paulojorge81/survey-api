import type { AddSurvey } from '@/domain/usecases';
import type { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/protocols';

import { badRequest, noContent, serverError } from '@/presentation/helpers';

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
        date: new Date(),
      });

      return noContent();
    } catch (error) {
      return serverError(error instanceof Error ? error : new Error('Internal server error'));
    }
  }
}

import type { AddSurvey } from '@/domain/usecases';
import type { Controller, HttpResponse, Validation } from '@/presentation/protocols';

import { badRequest, noContent, serverError } from '@/presentation/helpers';

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey,
  ) {}

  async handle(request: AddSurveyController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);

      if (error) {
        return badRequest(error);
      }
      const { question, answers } = request;

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

export namespace AddSurveyController {
  export type Request = {
    question: string;
    answers: Answer[];
  };

  type Answer = {
    image?: string;
    answer: string;
  };
}

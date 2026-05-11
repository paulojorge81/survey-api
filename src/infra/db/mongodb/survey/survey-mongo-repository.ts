import type { AddSurveyRepository } from '@/data/usecases/add-survey/db-add-survey-protocols';
import type { AddSurveyModel } from '@/domain/usecases/add-survey';
import { MongoHelper, type SurveyMongoModel } from '../helpers/mongo-helper';
import type { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository';
import type { SurveyModel } from '@/domain/models/surveys';

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async add(data: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(data);
    await Promise.resolve();
  }

  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const surveys = await surveyCollection.find<SurveyMongoModel>({}).toArray();
    return surveys.map((survey) => MongoHelper.mapModel(survey));
  }
}

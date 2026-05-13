import type { AddSurveyRepository } from '@/data/usecases/add-survey/db-add-survey-protocols';
import type { AddSurveyModel } from '@/domain/usecases/add-survey';
import { MongoHelper, type SurveyMongoModel } from '@/infra/db/mongodb/helpers/mongo-helper';
import type { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository';
import type { SurveyModel } from '@/domain/models/surveys';
import type { LoadSurveyByIdRepository } from '@/data/usecases/load-survey-by-id/db-load-survey-by-id-protocols';
import { ObjectId } from 'mongodb';

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
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

  async loadById(id: string): Promise<SurveyModel | null> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const survey = await surveyCollection.findOne<SurveyMongoModel>({ _id: new ObjectId(id) });
    if (!survey) return null;
    return MongoHelper.mapModel(survey);
  }
}

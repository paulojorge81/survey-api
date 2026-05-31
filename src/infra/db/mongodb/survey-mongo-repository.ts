/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ObjectId } from 'mongodb';

import type {
  AddSurveyRepository,
  LoadSurveyByIdRepository,
  CheckSurveyByIdRepository,
  LoadAnswersBySurveyRepository,
} from '@/data/protocols';
import type { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository';
import type { SurveyModel } from '@/domain/models/surveys';

import { QueryBuilder } from '@/infra/db';
import { MongoHelper, type SurveyMongoModel } from '@/infra/db/mongodb/mongo-helper';

export class SurveyMongoRepository
  implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository,
    CheckSurveyByIdRepository,
    LoadAnswersBySurveyRepository
{
  async add(data: AddSurveyRepository.Params): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(data);
    await Promise.resolve();
  }

  async loadAll(accountId: string): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection<SurveyMongoModel>('surveys');
    const query = new QueryBuilder()
      .lookup({
        from: 'surveyResults',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result',
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [
            {
              $size: {
                $filter: {
                  input: '$result',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.accountId', accountId],
                  },
                },
              },
            },
            1,
          ],
        },
      })
      .build();

    const surveys = await surveyCollection.aggregate<SurveyMongoModel>(query).toArray();
    return MongoHelper.mapCollection(surveys);
  }

  async checkById(id: string): Promise<CheckSurveyByIdRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection<SurveyMongoModel>('surveys');
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) }, { projection: { _id: 1 } });
    return survey !== null;
  }

  async loadById(id: string): Promise<LoadSurveyByIdRepository.Result | null> {
    const surveyCollection = await MongoHelper.getCollection<SurveyMongoModel>('surveys');
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) });
    if (!survey) return null;
    return MongoHelper.mapModel(survey);
  }

  async loadAnswers(id: string): Promise<LoadAnswersBySurveyRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection<SurveyMongoModel>('surveys');
    const query = new QueryBuilder()
      .match({
        _id: new ObjectId(id),
      })
      .project({
        _id: 0,
        answers: '$answers.answer',
      })
      .build();
    const survey = await surveyCollection.aggregate<{ answers: string[] }>(query).toArray();
    return survey[0]?.answers ?? [];
  }
}

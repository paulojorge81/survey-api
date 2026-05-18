/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ObjectId } from 'mongodb';

import type {
  SaveSurveyResultParams,
  SaveSurveyResultRepository,
  SurveyResultModel,
} from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols';

import { MongoHelper, type SurveyResultMongoModel } from '@/infra/db/mongodb/helpers/mongo-helper';

import { QueryBuilder } from '../helpers';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const { surveyId, accountId } = data;
    const surveyObjectId = new ObjectId(surveyId);
    const accountObjectId = new ObjectId(accountId);
    const surveyResultCollection = await MongoHelper.getCollection<SurveyResultMongoModel>('surveyResults');
    await surveyResultCollection.findOneAndUpdate(
      {
        surveyId: surveyObjectId,
        accountId: accountObjectId,
      },
      {
        $set: {
          answer: data.answer,
          date: data.date,
        },
      },
      {
        upsert: true,
      },
    );

    const surveyResult = await this.loadBySurveyId(surveyId);

    return surveyResult;
  }

  private async loadBySurveyId(surveyId: string | ObjectId): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection<SurveyResultMongoModel>('surveyResults');

    const query = new QueryBuilder()
      .match({
        surveyId: new ObjectId(surveyId),
      })
      .group({
        _id: 0,
        data: {
          $push: '$$ROOT',
        },
        count: {
          $sum: 1,
        },
      })
      .unwind({
        path: '$data',
      })
      .lookup({
        from: 'surveys',
        foreignField: '_id',
        localField: 'data.surveyId',
        as: 'survey',
      })
      .unwind({
        path: '$survey',
      })
      .group({
        _id: {
          surveyId: '$survey._id',
          question: '$survey.question',
          date: '$survey.date',
          total: '$count',
          answer: {
            $filter: {
              input: '$survey.answers',
              as: 'item',
              cond: {
                $eq: ['$$item.answer', '$data.answer'],
              },
            },
          },
        },
        count: {
          $sum: 1,
        },
      })
      .unwind({
        path: '$_id.answer',
      })
      .addFields({
        '_id.answer.count': '$count',
        '_id.answer.percent': {
          $multiply: [
            {
              $divide: ['$count', '$_id.total'],
            },
            100,
          ],
        },
      })
      .group({
        _id: {
          surveyId: '$_id.surveyId',
          question: '$_id.question',
          date: '$_id.date',
        },
        answers: {
          $push: '$_id.answer',
        },
      })
      .project({
        _id: 0,
        surveyId: {
          $toString: '$_id.surveyId',
        },
        question: '$_id.question',
        date: '$_id.date',
        answers: '$answers',
      })
      .build();
    const surveyResult = await surveyResultCollection.aggregate<SurveyResultModel>(query).toArray();
    return surveyResult[0];
  }
}

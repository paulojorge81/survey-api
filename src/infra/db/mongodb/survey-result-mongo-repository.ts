/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ObjectId } from 'mongodb';

import type { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data/protocols';

import { QueryBuilder, MongoHelper, type SurveyResultMongoModel } from '@/infra/db';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository, LoadSurveyResultRepository {
  async save(data: SaveSurveyResultRepository.Params): Promise<void> {
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
  }

  async loadBySurveyId(
    surveyId: string | ObjectId,
    accountId: string,
  ): Promise<LoadSurveyResultRepository.Result | null> {
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
        total: {
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
          total: '$total',
          answer: '$data.answer',
          answers: '$survey.answers',
        },
        count: {
          $sum: 1,
        },
        currentAccountAnswer: {
          $push: {
            $cond: [{ $eq: ['$data.accountId', new ObjectId(accountId)] }, '$data.answer', null],
          },
        },
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $map: {
            input: '$_id.answers',
            as: 'item',
            in: {
              $mergeObjects: [
                '$$item',
                {
                  count: {
                    $cond: {
                      if: {
                        $eq: ['$$item.answer', '$_id.answer'],
                      },
                      then: '$count',
                      else: 0,
                    },
                  },
                  percent: {
                    $cond: {
                      if: {
                        $eq: ['$$item.answer', '$_id.answer'],
                      },
                      then: {
                        $multiply: [{ $divide: ['$count', '$_id.total'] }, 100],
                      },
                      else: 0,
                    },
                  },
                  isCurrentAccountAnswer: {
                    $eq: ['$$item.answer', { $arrayElemAt: ['$currentAccountAnswer', 0] }],
                  },
                },
              ],
            },
          },
        },
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date',
        },
        answers: {
          $push: '$answers',
        },
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $reduce: {
            input: '$answers',
            initialValue: [],
            in: {
              $concatArrays: ['$$value', '$$this'],
            },
          },
        },
      })
      .unwind({
        path: '$answers',
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date',
          answer: '$answers.answer',
          image: '$answers.image',
          isCurrentAccountAnswer: '$answers.isCurrentAccountAnswer',
        },
        count: {
          $sum: '$answers.count',
        },
        percent: {
          $sum: '$answers.percent',
        },
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answer: {
          answer: '$_id.answer',
          image: '$_id.image',
          count: { $round: ['$count'] },
          percent: { $round: ['$percent'] },
          isCurrentAccountAnswer: '$_id.isCurrentAccountAnswer',
        },
      })
      .sort({
        'answer.count': -1,
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date',
        },
        answers: {
          $push: '$answer',
        },
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: '$answers',
      })
      .build();
    const surveyResult = await surveyResultCollection.aggregate<LoadSurveyResultRepository.Result>(query).toArray();

    return surveyResult.length > 0 ? surveyResult[0] : null;
  }
}

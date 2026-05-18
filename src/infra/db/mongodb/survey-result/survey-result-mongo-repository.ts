import { ObjectId } from 'mongodb';

import type {
  SaveSurveyResultParams,
  SaveSurveyResultRepository,
  SurveyResultModel,
} from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols';

import { MongoHelper, type SurveyResultMongoModel } from '@/infra/db/mongodb/helpers/mongo-helper';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const { surveyId, accountId } = data;
    const surveyObjectId = new ObjectId(surveyId);
    const accountObjectId = new ObjectId(accountId);
    const surveyResultCollection = await MongoHelper.getCollection<SurveyResultMongoModel>('surveyResults');
    const surveyResult = await surveyResultCollection.findOneAndUpdate(
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
        returnDocument: 'after',
      },
    );

    if (!surveyResult) {
      throw new Error('Failed to save survey result');
    }

    return MongoHelper.mapModel(surveyResult);
  }
}

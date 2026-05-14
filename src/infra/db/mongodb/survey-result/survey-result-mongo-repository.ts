import type {
  SaveSurveyResultModel,
  SaveSurveyResultRepository,
} from '@/data/usecases/save-survey-result/db-save-survey-result-protocols';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(data: SaveSurveyResultModel): Promise<any> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults');
    const surveyResult = await surveyResultCollection.findOneAndUpdate(
      {
        surveyId: data.surveyId,
        accountId: data.accountId,
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

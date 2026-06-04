import { authTypeDefs } from '@/main/graphql/type-defs/auth';
import { baseTypeDefs } from '@/main/graphql/type-defs/base';
import { surveyTypeDefs } from '@/main/graphql/type-defs/survey';
import { surveyResultTypeDefs } from '@/main/graphql/type-defs/survey-result';

export default [baseTypeDefs, authTypeDefs, surveyTypeDefs, surveyResultTypeDefs];

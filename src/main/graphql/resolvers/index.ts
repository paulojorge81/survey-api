import { authResolver } from '@/main/graphql/resolvers/auth';
import { baseResolver } from '@/main/graphql/resolvers/base';
import { surveyResolver } from '@/main/graphql/resolvers/survey';
import { surveyResultResolver } from '@/main/graphql/resolvers/survey-result';

export default [authResolver, surveyResolver, baseResolver, surveyResultResolver];

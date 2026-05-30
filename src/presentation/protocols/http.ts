import type { HttpStatusCode } from '@/presentation/http';

export type HttpResponse = {
  statusCode: HttpStatusCode;
  body: any;
};

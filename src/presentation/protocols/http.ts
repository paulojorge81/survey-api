import type { HttpStatusCode } from '@/presentation/http';

export type HttpResponse = {
  statusCode: HttpStatusCode;
  body: any;
};

export type HttpRequest = {
  body?: any;
  headers?: any;
  params?: any;
  accountId?: string;
};

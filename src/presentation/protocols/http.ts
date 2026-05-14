import type { HttpStatusCode } from '@/presentation/http/http-status-code';

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

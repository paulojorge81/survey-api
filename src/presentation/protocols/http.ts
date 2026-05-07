import type { HttpStatusCode } from '@/presentation/http/http-status-code';

export interface HttpResponse {
  statusCode: HttpStatusCode;
  body: any;
}

export interface HttpRequest {
  body?: any;
}

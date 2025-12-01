import { JWTPayloadModel } from '@/domain/interfaces/jwt';

export interface HttpResponse {
  statusCode: number;
  body: any;
  type?: string;
  headers?: { key: string; value: string }[];
}

export interface RequestParams {
  [key: string]: string;
}

export interface RequestQueryString {
  [key: string]: undefined | string | string[];
}

export interface FileAdapterModel {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

export interface HttpRequest {
  headers?: any;
  params?: any;
  query?: any;
  body?: any;
  path?: string;
  method?: string;
  file?: FileAdapterModel;
  files?: FileAdapterModel[];
  ip?: any;
  user?: JWTPayloadModel;
}

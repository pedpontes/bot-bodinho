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

export interface File {
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
  file?: File;
  path?: string;
  method?: string;
  files?: File[];
  ip?: any;
}

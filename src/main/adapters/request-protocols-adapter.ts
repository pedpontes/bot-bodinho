export interface RequestProtocolAdapter {
  headers?: any;
  query?: any;
  params?: any;
  body?: any;
  path?: string;
  method?: string;
  file?: any;
  files?: any;
}

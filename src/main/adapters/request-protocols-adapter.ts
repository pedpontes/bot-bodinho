export interface RequestProtocolAdapter {
  headers?: any;
  query?: any;
  params?: any;
  body?: any;
  file?: any;
  path?: string;
  method?: string;
  files?: any;
}

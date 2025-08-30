import { HttpResponse } from '../http';

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const unprocessableEntity = (error: Error): HttpResponse => ({
  statusCode: 422,
  body: error,
});

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error,
});

export const notFound = (): HttpResponse => ({
  statusCode: 404,
  body: null,
});

export const unauthorized = (error?: Error): HttpResponse => ({
  statusCode: 401,
  body: error || {},
});

export const serverError = (error: any): HttpResponse => ({
  statusCode: 500,
  body: error,
});

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});

export const created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data,
});

export const file = (data: any, type = 'json'): HttpResponse => ({
  statusCode: 200,
  body: data,
  type,
});

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null,
});

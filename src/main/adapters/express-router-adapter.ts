import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation/protocols';
import { Response } from 'express';
import { Readable } from 'node:stream';
import { RequestProtocolAdapter } from './request-protocols-adapter';

export const adaptRoute = (controller: Controller) => {
  return async (request: RequestProtocolAdapter, response: Response) => {
    const abortController = new AbortController();

    const httpRequest: HttpRequest = {
      params: request.params,
      query: request.query,
      body: request.body,
      file: request.file,
      files: request?.files,
      path: request.path,
      method: request.method?.toLowerCase(),
      headers: request.headers,
      user: (request as any).user,
    };

    const controllerHttpResponse: HttpResponse =
      await controller.handle(httpRequest);

    const {
      body,
      statusCode,
      type,
      headers: headersResponse,
    } = controllerHttpResponse;

    const headers: { [key: string]: string } = {};

    headersResponse?.forEach(({ key, value }) => {
      headers[key] = value;
    });

    if (body instanceof Readable) {
      response.on('close', () => {
        abortController.abort();
      });

      response.writeHead(206, headers);

      body.pipe(response);

      return;
    }

    response.set(headers);
    response.status(statusCode);

    if (statusCode >= 200 && statusCode <= 299) {
      if (type) response.contentType(type);
      return response.send(body);
    }

    if (statusCode === 302) return response.redirect(body);

    if (statusCode === 500)
      return response.send({
        error: '[SERVICE INTERNAL ERROR] ' + body,
      });

    if (body?.code) return response.send(body);
    else
      return response.send({
        error: body?.message,
      });
  };
};

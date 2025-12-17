import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    this.logger.error(
      {
        req: {
          id: request.id,
          method: request.method,
          url: request.url,
        },
        err: exception,
      },
      'Unhandled exception',
    );

    if (response.headersSent) {
      return;
    }

    if (exception instanceof HttpException) {
      response.status(status).json(exception.getResponse());
      return;
    }

    response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}

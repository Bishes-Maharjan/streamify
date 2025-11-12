/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WinstonLoggerService } from '../winston/winston.service';

@Catch()
export class ExceptionHandler implements ExceptionFilter {
  constructor(private readonly logger: WinstonLoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const { url, method, ip, headers } = request;
    const userAgent = headers['user-agent'];

    let message = 'Internal server error';
    let stack: string | undefined;

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      message =
        typeof response === 'object' && response !== null
          ? (response as any).message || JSON.stringify(response)
          : String(response);
      stack = '';
    } else if (exception instanceof Error) {
      message = exception.message;
      stack = exception.stack;
    }

    this.logger.error({
      statusCode,
      method,
      url,
      message,
      ip,
      userAgent,
      stack,
    });
    console.log({
      statusCode,
      method,
      url,
      message,
      ip,
      userAgent,
      stack,
    });
    response.status(statusCode).json({
      success: false,
      statusCode,
      method,
      message,
      url,
    });
  }
}

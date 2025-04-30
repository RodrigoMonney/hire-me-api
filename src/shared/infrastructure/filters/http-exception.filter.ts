import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Exception } from './exception.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly config: ConfigService) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const url = request.url;

    const stack = this.formatStack(exception.stack);

    const result: Exception = {
      title: exception.name,
      status: this.getStatus(exception),
      instance: url,
      detail: exception.message,
      stack,
    };

    response.status(result.status).json({ result });
  }

  private getStatus(exception: Error): number {
    return exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private formatStack(stack?: string): string[] | undefined {
    const env = this.config.get<string>('NODE_ENV');

    if (!stack || env === 'production') return;

    return stack.split('\n').map((line) => line.trim());
  }
}

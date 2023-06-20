import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

import { ExceptionResponse } from '@databank/types';
import { Request, Response } from 'express';
import { P, match } from 'ts-pattern';

import { I18nService } from '@/i18n/i18n.service.js';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly i18n: I18nService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    this.logger.error(exception);

    let statusCode: HttpStatus;
    let message: string;
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = match(exception.getResponse())
        .with(P.string, (res) => res)
        .with({ message: P.string }, (res) => res.message)
        .otherwise(() => 'An unexpected error occurred');
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal Server Error';
    }

    res.status(statusCode).send({ message } satisfies ExceptionResponse);
  }
}

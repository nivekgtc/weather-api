import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const i18n = I18nContext.current(host);
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let messageKey: any = 'errors.INTERNAL_SERVER_ERROR';
    let errors: string[] | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
      const exceptionResponse = exception.getResponse();

      if (
        exception instanceof BadRequestException &&
        typeof exceptionResponse === 'object' &&
        'message' in exceptionResponse
      ) {
        errors = Array.isArray(exceptionResponse.message)
          ? await Promise.all(
              exceptionResponse.message.map((msg) => i18n.translate(msg)),
            )
          : [await i18n.translate(exceptionResponse.message as string)];

        messageKey = 'errors.VALIDATION_ERROR';
      } else if (exception instanceof ThrottlerException) {
        messageKey = exception.message;
      } else if (
        typeof exceptionResponse === 'object' &&
        'message' in exceptionResponse
      ) {
        messageKey = exceptionResponse['message'] || 'errors.UNKNOWN_ERROR';
      }
    }

    const translatedMessage = await i18n.translate(messageKey);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: translatedMessage,
      errors,
    });
  }
}

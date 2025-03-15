import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nService } from 'nestjs-i18n';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'errors.INTERNAL_SERVER_ERROR';
    let errors: string[] | undefined;

    const lang = request.headers['accept-language'] || 'en';

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      // Se for erro de validação do ValidationPipe
      if (
        exception instanceof BadRequestException &&
        typeof exceptionResponse === 'object' &&
        'message' in exceptionResponse
      ) {
        errors = Array.isArray(exceptionResponse.message)
          ? await Promise.all(
              exceptionResponse.message.map((msg) =>
                this.i18n.translate(msg, { lang }),
              ),
            )
          : [
              await this.i18n.translate(exceptionResponse.message as string, {
                lang,
              }),
            ];

        message = 'errors.VALIDATION_ERROR'; // Mensagem genérica para erro de validação
      } else {
        message = await this.i18n.translate(exception.message, { lang });
      }
    } else {
      message = await this.i18n.translate(message, { lang });
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      errors,
    });
  }
}

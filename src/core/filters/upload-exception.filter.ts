import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { UploadException } from '../core.errors';

@Catch(UploadException)
export class UploadExceptionFilter implements ExceptionFilter {
  catch(exception: UploadException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(400).json({
      statusCode: 400,
      message: [
        {
          value: exception.file || null,
          property: exception.field,
          children: [],
          constraints: {
            isValidFile: exception.message,
          },
        },
      ],
      error: 'Bad Request',
    });
  }
}

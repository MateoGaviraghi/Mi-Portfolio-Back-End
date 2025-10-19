import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | string[];
  error?: string;
  details?: unknown;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    let message: string | string[] = 'Internal server error';
    let error: string | undefined;
    let details: unknown;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse) {
      const responseObj = exceptionResponse as {
        message?: string | string[];
        error?: string;
        details?: unknown;
      };
      message = responseObj.message || message;
      error = responseObj.error;
      details = responseObj.details;
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
    };

    // Add error name if available
    if (error) {
      errorResponse.error = error;
    }

    // Add additional details for validation errors
    if (details) {
      errorResponse.details = details;
    }

    // Log with appropriate level
    const logMessage = `${request.method} ${request.url} - ${status}`;
    if (status >= 500) {
      this.logger.error(
        logMessage,
        exception instanceof Error ? exception.stack : 'Unknown error',
      );
    } else if (status >= 400) {
      this.logger.warn(
        `${logMessage} | Message: ${typeof message === 'string' ? message : JSON.stringify(message)}`,
      );
    }

    response.status(status).json(errorResponse);
  }
}

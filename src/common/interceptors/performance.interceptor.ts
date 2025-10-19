import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PerformanceInterceptor.name);
  private readonly SLOW_REQUEST_THRESHOLD = 1000; // 1 second

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || 'unknown';
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const response = context.switchToHttp().getResponse<Response>();

          // Log slow requests
          if (duration > this.SLOW_REQUEST_THRESHOLD) {
            this.logger.warn(
              `⚠️ SLOW REQUEST: ${method} ${url} - ${duration}ms | IP: ${ip} | Status: ${response.statusCode}`,
            );
          }

          // Log detailed performance metrics
          this.logger.debug(
            JSON.stringify({
              method,
              url,
              duration,
              statusCode: response.statusCode,
              ip,
              userAgent,
              timestamp: new Date().toISOString(),
            }),
          );
        },
        error: (error: Error) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            `❌ ERROR: ${method} ${url} - ${duration}ms | Error: ${error.message}`,
          );
        },
      }),
    );
  }
}

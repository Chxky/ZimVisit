import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const clientIp = request.headers['x-forwarded-for'] || request.connection?.remoteAddress || request.ip;
    const userAgent = request.headers['user-agent'] || 'unknown';
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const duration = Date.now() - startTime;
          this.logger.log(`${method} ${url} ${response.statusCode} ${duration}ms | IP: ${clientIp} | UA: ${userAgent}`);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error(`${method} ${url} ${error.status || 500} ${duration}ms - ${error.message} | IP: ${clientIp} | UA: ${userAgent}`);
        },
      }),
    );
  }
}

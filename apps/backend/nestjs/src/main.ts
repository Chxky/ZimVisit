import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { MetricsInterceptor } from './common/interceptors/metrics.interceptor';
import { SanitizationInterceptor } from './common/security/sanitization.interceptor';
import { CsrfGuard } from './common/guards/csrf.guard';
import { setupSwagger } from './config/swagger.config';
import { createLogger } from './config/logger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: createLogger(),
  });
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: ["'self'", "https://api.zimvisit.co.zw", "wss:"],
        frameAncestors: ["'self'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  } as any));

  // Middleware to capture IP and User-Agent for audit trail
  app.use((req: any, _res: any, next: any) => {
    req.clientIp = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || req.ip;
    req.userAgent = req.headers['user-agent'] || 'unknown';
    next();
  });

  app.setGlobalPrefix(configService.get('API_PREFIX', 'api/v1'), {
    exclude: ['health', 'health/liveness', 'health/readiness', 'metrics'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new SanitizationInterceptor(), new LoggingInterceptor(), new MetricsInterceptor(), new TransformInterceptor(), new TimeoutInterceptor());
  app.useGlobalGuards(new CsrfGuard());

  app.enableCors({
    origin: [
      'http://localhost',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'https://admin.zimvisit.co.zw',
      'https://gov.zimvisit.co.zw',
      'https://zimvisit.co.zw',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Requested-With'],
  });

  app.enableShutdownHooks();

  setupSwagger(app);

  const port = configService.get('PORT', 3000);
  await app.listen(port);
  logger.log(`ZimVisit API running on port ${port}`);
  logger.log(`Environment: ${configService.get('NODE_ENV')}`);
  logger.log(`API Docs: http://localhost:${port}/api/docs`);
}
bootstrap();

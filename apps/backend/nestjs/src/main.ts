import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  app.use(helmet());

  // Middleware to capture IP and User-Agent for audit trail
  app.use((req: any, _res: any, next: any) => {
    req.clientIp = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || req.ip;
    req.userAgent = req.headers['user-agent'] || 'unknown';
    next();
  });

  app.setGlobalPrefix(configService.get('API_PREFIX', 'api/v1'), {
    exclude: ['health', 'health/liveness', 'health/readiness'],
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
  app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor(), new TimeoutInterceptor());

  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'https://admin.zimvisit.co.zw',
      'https://gov.zimvisit.co.zw',
      'https://zimvisit.co.zw',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
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

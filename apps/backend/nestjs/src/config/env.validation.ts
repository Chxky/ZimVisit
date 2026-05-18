import { plainToInstance } from 'class-transformer';
import { IsString, IsNumber, IsOptional, Min, Max, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsString()
  NODE_ENV: string = 'development';

  @IsNumber()
  @Min(1024)
  @Max(65535)
  PORT: number = 3000;

  @IsString()
  API_PREFIX: string = 'api/v1';

  @IsString()
  DB_HOST: string = 'localhost';

  @IsNumber()
  @Min(1)
  @Max(65535)
  DB_PORT: number = 5432;

  @IsString()
  DB_USERNAME: string = 'zimvisit';

  @IsString()
  DB_PASSWORD: string = 'zimvisit_secret';

  @IsString()
  DB_DATABASE: string = 'zimvisit';

  @IsOptional()
  @IsString()
  DB_DRIVER: string = 'sqlite';

  @IsString()
  JWT_SECRET: string = 'change-in-production';

  @IsString()
  @IsOptional()
  JWT_EXPIRES_IN: string = '7d';

  @IsString()
  @IsOptional()
  REDIS_HOST: string = 'localhost';

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(65535)
  REDIS_PORT: number = 6379;

  @IsString()
  @IsOptional()
  AI_SERVICE_URL: string = 'http://ai-service:8000';

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1)
  TOURISM_LEVY_RATE: number = 0.02;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1)
  VAT_RATE: number = 0.15;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1)
  BSP_PLATFORM_FEE: number = 0.03;
}

export function validateEnv(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, {
    skipMissingProperties: false,
    forbidUnknownValues: false,
  });

  if (errors.length > 0) {
    throw new Error(
      `Environment validation failed: ${errors
        .map((e) => `${e.property}: ${Object.values(e.constraints || {}).join(', ')}`)
        .join('; ')}`,
    );
  }

  return validated;
}

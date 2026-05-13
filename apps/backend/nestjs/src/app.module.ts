import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { ComplianceModule } from './modules/compliance/compliance.module';
import { GdsModule } from './modules/gds/gds.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { OperatorsModule } from './modules/operators/operators.module';
import { HealthController } from './common/health.controller';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { validateEnv } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local', '.env.production'],
      validate: validateEnv,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbDriver = config.get('DB_DRIVER', 'sqlite');
        if (dbDriver === 'postgres') {
          return {
            type: 'postgres',
            host: config.get('DB_HOST', 'localhost'),
            port: config.get('DB_PORT', 5432),
            username: config.get('DB_USERNAME', 'zimvisit'),
            password: config.get('DB_PASSWORD', 'zimvisit_secret'),
            database: config.get('DB_DATABASE', 'zimvisit'),
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: config.get('NODE_ENV') !== 'production',
            logging: config.get('NODE_ENV') === 'development',
          };
        }
        return {
          type: 'sqljs',
          location: config.get('SQLITE_PATH', 'data/zimvisit.db'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: config.get('NODE_ENV') === 'development',
          autoSave: true,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      },
    }),
    AuthModule,
    UsersModule,
    BookingsModule,
    PaymentsModule,
    InventoryModule,
    ComplianceModule,
    GdsModule,
    NotificationsModule,
    OperatorsModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}

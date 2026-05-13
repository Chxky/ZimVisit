import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from './decorators/public.decorator';

@SkipThrottle()
@Controller()
export class HealthController {
  @Public()
  @Get('health')
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
      service: 'zimvisit-api',
    };
  }

  @Public()
  @Get()
  root() {
    return {
      service: 'ZimVisit API',
      version: '1.0.0',
      docs: '/api/docs',
      endpoints: {
        health: '/api/v1/health',
        auth: '/api/v1/auth/login',
        tours: '/api/v1/inventory/tours',
        hotels: '/api/v1/inventory/hotels',
        bookings: '/api/v1/bookings',
        payments: '/api/v1/payments',
        operators: '/api/v1/operators',
        compliance: '/api/v1/compliance',
        notifications: '/api/v1/notifications',
      },
    };
  }
}

import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from './decorators/public.decorator';
import * as net from 'net';

@SkipThrottle()
@Controller()
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

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
  @Get('health/liveness')
  liveness() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Public()
  @Get('health/readiness')
  async readiness() {
    let dbStatus = 'disconnected';
    try {
      await this.dataSource.query('SELECT 1');
      dbStatus = 'connected';
    } catch (err) {
      dbStatus = `disconnected: ${err.message}`;
    }

    let redisStatus = 'disconnected';
    try {
      const host = process.env.REDIS_HOST || 'localhost';
      const port = parseInt(process.env.REDIS_PORT || '6379');
      await this.checkTcpConnection(host, port);
      redisStatus = 'connected';
    } catch (err) {
      redisStatus = `disconnected: ${err.message}`;
    }

    return {
      status: dbStatus === 'connected' && redisStatus === 'connected' ? 'ready' : 'unready',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus,
      redis: redisStatus,
    };
  }

  private checkTcpConnection(host: string, port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const socket = new net.Socket();
      socket.setTimeout(1000);
      socket.once('connect', () => {
        socket.destroy();
        resolve();
      });
      socket.once('timeout', () => {
        socket.destroy();
        reject(new Error('Connection timeout'));
      });
      socket.once('error', (err) => {
        socket.destroy();
        reject(err);
      });
      socket.connect(port, host);
    });
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

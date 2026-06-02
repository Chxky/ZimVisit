import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, Logger } from '@nestjs/common';

const failedAttempts = new Map<string, { count: number; blockedUntil: number; windowStart: number }>();
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes
const WINDOW = 5 * 60 * 1000; // 5 minute window

@Injectable()
export class BruteForceGuard implements CanActivate {
  private readonly logger = new Logger(BruteForceGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const ip = req.clientIp || req.ip || 'unknown';
    const now = Date.now();

    const record = failedAttempts.get(ip);
    if (record) {
      if (record.blockedUntil > now) {
        this.logger.warn(`Blocked brute force attempt from ${ip}`);
        throw new HttpException(
          'Too many failed attempts. Try again later.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      // Clean up expired block records
      if (record.blockedUntil > 0 && now - record.blockedUntil > WINDOW) {
        failedAttempts.delete(ip);
      }
    }
    return true;
  }

  static recordFailure(ip: string): void {
    const now = Date.now();
    const record = failedAttempts.get(ip) || { count: 0, blockedUntil: 0, windowStart: now };

    // Reset window if it has expired
    if (now - record.windowStart > WINDOW) {
      record.count = 0;
      record.windowStart = now;
    }

    record.count++;
    if (record.count >= MAX_ATTEMPTS) {
      record.blockedUntil = now + BLOCK_DURATION;
      record.count = 0;
      record.windowStart = now;
    }

    failedAttempts.set(ip, record);
  }

  static clearFailures(ip: string): void {
    failedAttempts.delete(ip);
  }
}

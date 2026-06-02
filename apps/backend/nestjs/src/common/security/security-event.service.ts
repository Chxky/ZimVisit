import { Injectable, Logger } from '@nestjs/common';

export interface SecurityEvent {
  type:
    | 'failed_login'
    | 'brute_force_blocked'
    | 'rate_limit_hit'
    | 'permission_denied'
    | 'suspicious_input'
    | 'csrf_violation';
  ip: string;
  userAgent?: string;
  userId?: string;
  details?: string;
  timestamp: Date;
}

@Injectable()
export class SecurityEventService {
  private readonly logger = new Logger('SecurityEvent');
  private events: SecurityEvent[] = [];
  private readonly maxEvents = 10000;

  logEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
    const fullEvent: SecurityEvent = { ...event, timestamp: new Date() };
    this.events.push(fullEvent);
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
    this.logger.warn(
      `[SECURITY] ${event.type} from ${event.ip}: ${event.details || 'no details'}`,
    );
  }

  getRecentEvents(limit = 100): SecurityEvent[] {
    return this.events.slice(-limit);
  }

  getEventsByType(type: SecurityEvent['type']): SecurityEvent[] {
    return this.events.filter((e) => e.type === type);
  }

  getEventsByIp(ip: string): SecurityEvent[] {
    return this.events.filter((e) => e.ip === ip);
  }

  getThreatSummary(): {
    total: number;
    failedLogins: number;
    bruteForceBlocked: number;
    rateLimitHits: number;
    permissionDenied: number;
    topIps: Array<{ ip: string; count: number }>;
  } {
    const last24h = Date.now() - 24 * 60 * 60 * 1000;
    const recent = this.events.filter((e) => e.timestamp.getTime() > last24h);
    return {
      total: recent.length,
      failedLogins: recent.filter((e) => e.type === 'failed_login').length,
      bruteForceBlocked: recent.filter((e) => e.type === 'brute_force_blocked').length,
      rateLimitHits: recent.filter((e) => e.type === 'rate_limit_hit').length,
      permissionDenied: recent.filter((e) => e.type === 'permission_denied').length,
      topIps: this.getTopIps(recent),
    };
  }

  private getTopIps(events: SecurityEvent[]): Array<{ ip: string; count: number }> {
    const ipCounts = new Map<string, number>();
    events.forEach((e) => ipCounts.set(e.ip, (ipCounts.get(e.ip) || 0) + 1));
    return [...ipCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([ip, count]) => ({ ip, count }));
  }
}

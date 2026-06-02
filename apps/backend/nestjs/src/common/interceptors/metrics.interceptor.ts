import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Global metrics storage (Prometheus-compatible format)
const metrics = {
  requests: 0,
  errors: 0,
  durations: [] as number[],
  byMethod: {} as Record<string, number>,
  byStatus: {} as Record<string, number>,
  byPath: {} as Record<string, number>,
  bookings: { total: 0, byStatus: {} as Record<string, number> },
  payments: { total: 0, byProvider: {} as Record<string, number>, byStatus: {} as Record<string, number> },
  compliance: { total: 0, byStatus: {} as Record<string, number> },
  revenue: { levy: 0, vat: 0, bspFee: 0 },
  startedAt: Date.now(),
};

export function getMetrics() {
  const sorted = [...metrics.durations].sort((a, b) => a - b);
  return {
    requests: metrics.requests,
    errors: metrics.errors,
    p50: sorted[Math.floor(sorted.length * 0.5)] || 0,
    p95: sorted[Math.floor(sorted.length * 0.95)] || 0,
    p99: sorted[Math.floor(sorted.length * 0.99)] || 0,
    byMethod: metrics.byMethod,
    byStatus: metrics.byStatus,
    bookings: metrics.bookings,
    payments: metrics.payments,
    compliance: metrics.compliance,
    revenue: metrics.revenue,
    uptime: Math.floor((Date.now() - metrics.startedAt) / 1000),
  };
}

export function recordBooking(status: string) {
  metrics.bookings.total++;
  metrics.bookings.byStatus[status] = (metrics.bookings.byStatus[status] || 0) + 1;
}

export function recordPayment(provider: string, status: string) {
  metrics.payments.total++;
  metrics.payments.byProvider[provider] = (metrics.payments.byProvider[provider] || 0) + 1;
  metrics.payments.byStatus[status] = (metrics.payments.byStatus[status] || 0) + 1;
}

export function recordCompliance(status: string) {
  metrics.compliance.total++;
  metrics.compliance.byStatus[status] = (metrics.compliance.byStatus[status] || 0) + 1;
}

export function recordRevenue(type: 'levy' | 'vat' | 'bspFee', amount: number) {
  metrics.revenue[type] += amount;
}

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startTime = Date.now();
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const path = req.route?.path || req.url;

    metrics.requests++;
    metrics.byMethod[method] = (metrics.byMethod[method] || 0) + 1;

    return next.handle().pipe(
      tap({
        error: () => {
          metrics.errors++;
        },
        next: () => {
          const res = context.switchToHttp().getResponse();
          const status = res.statusCode?.toString() || '200';
          metrics.byStatus[status] = (metrics.byStatus[status] || 0) + 1;
        },
        finalize: () => {
          const duration = Date.now() - startTime;
          metrics.durations.push(duration);
          if (metrics.durations.length > 10000) metrics.durations.shift();

          // Normalize path for metrics cardinality
          const normalizedPath = path
            .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id')
            .replace(/\/\d+/g, '/:id');
          metrics.byPath[normalizedPath] = (metrics.byPath[normalizedPath] || 0) + 1;
        },
      }),
    );
  }
}

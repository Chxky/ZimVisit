import { Controller, Get, Header } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';
import { getMetrics } from '../interceptors/metrics.interceptor';
import { ApiExcludeController, ApiOperation } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('metrics')
export class MetricsController {
  @Public()
  @Get()
  @Header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
  @ApiOperation({ summary: 'Prometheus-compatible metrics endpoint' })
  getMetrics() {
    const m = getMetrics();
    const lines: string[] = [];

    // HTTP Request metrics
    lines.push('# HELP zimvisit_http_requests_total Total HTTP requests');
    lines.push('# TYPE zimvisit_http_requests_total counter');
    lines.push(`zimvisit_http_requests_total ${m.requests}`);

    lines.push('# HELP zimvisit_http_errors_total Total HTTP errors');
    lines.push('# TYPE zimvisit_http_errors_total counter');
    lines.push(`zimvisit_http_errors_total ${m.errors}`);

    lines.push('# HELP zimvisit_http_request_duration_ms Request duration in milliseconds');
    lines.push('# TYPE zimvisit_http_request_duration_ms summary');
    if (m.p50 > 0) {
      lines.push(`zimvisit_http_request_duration_ms{quantile="0.5"} ${m.p50}`);
      lines.push(`zimvisit_http_request_duration_ms{quantile="0.95"} ${m.p95}`);
      lines.push(`zimvisit_http_request_duration_ms{quantile="0.99"} ${m.p99}`);
    }

    // By method
    lines.push('# HELP zimvisit_http_requests_by_method Total requests by HTTP method');
    lines.push('# TYPE zimvisit_http_requests_by_method counter');
    for (const [method, count] of Object.entries(m.byMethod)) {
      lines.push(`zimvisit_http_requests_by_method{method="${method}"} ${count}`);
    }

    // By status
    lines.push('# HELP zimvisit_http_requests_by_status Total requests by status code');
    lines.push('# TYPE zimvisit_http_requests_by_status counter');
    for (const [status, count] of Object.entries(m.byStatus)) {
      lines.push(`zimvisit_http_requests_by_status{status="${status}"} ${count}`);
    }

    // Business metrics - Bookings
    lines.push('# HELP zimvisit_bookings_total Total bookings created');
    lines.push('# TYPE zimvisit_bookings_total counter');
    lines.push(`zimvisit_bookings_total ${m.bookings.total}`);
    for (const [status, count] of Object.entries(m.bookings.byStatus)) {
      lines.push(`zimvisit_bookings_total{status="${status}"} ${count}`);
    }

    // Business metrics - Payments
    lines.push('# HELP zimvisit_payments_total Total payment transactions');
    lines.push('# TYPE zimvisit_payments_total counter');
    lines.push(`zimvisit_payments_total ${m.payments.total}`);
    for (const [provider, count] of Object.entries(m.payments.byProvider)) {
      lines.push(`zimvisit_payments_total{provider="${provider}"} ${count}`);
    }

    // Business metrics - Compliance
    lines.push('# HELP zimvisit_compliance_reports_total Total compliance reports');
    lines.push('# TYPE zimvisit_compliance_reports_total counter');
    lines.push(`zimvisit_compliance_reports_total ${m.compliance.total}`);
    for (const [status, count] of Object.entries(m.compliance.byStatus)) {
      lines.push(`zimvisit_compliance_reports_total{status="${status}"} ${count}`);
    }

    // Revenue metrics
    lines.push('# HELP zimvisit_revenue_collected_usd Revenue collected in USD');
    lines.push('# TYPE zimvisit_revenue_collected_usd counter');
    lines.push(`zimvisit_revenue_collected_usd{type="levy"} ${m.revenue.levy}`);
    lines.push(`zimvisit_revenue_collected_usd{type="vat"} ${m.revenue.vat}`);
    lines.push(`zimvisit_revenue_collected_usd{type="bsp_fee"} ${m.revenue.bspFee}`);

    // System metrics
    lines.push('# HELP zimvisit_up Whether the service is up');
    lines.push('# TYPE zimvisit_up gauge');
    lines.push('zimvisit_up 1');

    lines.push('# HELP zimvisit_uptime_seconds Service uptime in seconds');
    lines.push('# TYPE zimvisit_uptime_seconds gauge');
    lines.push(`zimvisit_uptime_seconds ${m.uptime}`);

    return lines.join('\n') + '\n';
  }

  @Public()
  @Get('json')
  @Header('Content-Type', 'application/json')
  @ApiOperation({ summary: 'Metrics in JSON format' })
  getMetricsJson() {
    return getMetrics();
  }
}

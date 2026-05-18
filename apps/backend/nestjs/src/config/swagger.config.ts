import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('ZimVisit API — Zimbabwe National Tourism Platform')
    .setDescription(
      `## Zimbabwe Tourism Booking & Compliance Platform

ZimVisit is the national tourism booking platform mandated by the Zimbabwe Tourism Authority (ZTA) and ZIMRA to capture tourism revenue, enforce compliance, and eliminate revenue leakage.

### Key Capabilities
- **Booking Management** — Full lifecycle booking with BSP-compliant routing
- **Payment Processing** — EcoCash, Paynow, and Stripe integration
- **Compliance Engine** — Automated ZTA levy (2%), VAT (15%), and BSP fee (3%) calculation
- **AI Agent Fingerprinting** — ML-powered anomaly detection for shell agencies
- **Revenue Forecasting** — Predictive analytics for national tourism revenue
- **Audit Trail** — Complete action logging for government oversight

### Authentication
All endpoints require JWT Bearer token unless marked as public.
Government officials (ZTA/ZIMRA) have elevated access to compliance and revenue data.

### Rate Limits
- Standard: 100 requests/minute
- Authenticated: 500 requests/minute
- Government: 1000 requests/minute
    `,
    )
    .setVersion('2.0')
    .setContact('ZimVisit Engineering', 'https://zimvisit.co.zw', 'api@zimvisit.co.zw')
    .setLicense('Proprietary', 'https://zimvisit.co.zw/license')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addApiKey(
      { type: 'apiKey', name: 'X-API-Key', in: 'header' },
      'api-key',
    )
    .addTag('Auth', 'Authentication and authorization - JWT token management, login, registration, password reset. All endpoints return JWT Bearer tokens for subsequent API calls.')
    .addTag('Users', 'User account management - profiles, roles, preferences. Supports traveler, operator, ZTA official, ZIMRA official, and system admin roles.')
    .addTag('Bookings', 'Tourism booking lifecycle - create bookings with automatic compliance checks, QR code generation, status tracking. Every booking triggers levy (2%), VAT (15%), and BSP fee (3%) calculation.')
    .addTag('Payments', 'Payment processing via Paynow, EcoCash, Stripe, and card. All transactions are logged with provider references for audit trail compliance.')
    .addTag('Inventory', 'Tourism inventory management - accommodations, tours, activities. Operators manage their own inventory with availability and pricing.')
    .addTag('Compliance', 'ZTA/ZIMRA compliance monitoring - real-time compliance checks, levy verification, BSP routing validation. Flagged transactions require official review before approval.')
    .addTag('Operators', 'Tourism operator registry - registration, license verification, compliance scoring, BSP connection status. Operators must maintain minimum compliance rates.')
    .addTag('Audit Trail', 'Immutable audit logging for government oversight - every compliance review, payment, and operator action is recorded with IP, user agent, and change details. Required for ZTA/ZIMRA regulatory audits.')
    .addTag('Reports', 'Government reporting suite - compliance summaries, revenue reports (levy/VAT/BSP), operator risk assessments, and audit trail exports. All reports support date filtering and CSV export.')
    .addTag('GDS', 'Global Distribution System integration - BSP routing via Travelport for airline bookings. Simulated in development, live in production.')
    .addTag('Notifications', 'System notifications - email, SMS, and push notification management for booking confirmations, compliance alerts, and payment receipts.')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'ZimVisit API Documentation',
    customfavIcon: '/favicon.svg',
    customCss: `
      .swagger-ui .topbar { background-color: #1e1b4b; }
      .swagger-ui .topbar .link { display: none; }
      .swagger-ui .topbar::after {
        content: 'ZIMVISIT API';
        color: #f59e0b;
        font-size: 20px;
        font-weight: 700;
        padding: 12px;
        display: block;
      }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
    },
  });
}

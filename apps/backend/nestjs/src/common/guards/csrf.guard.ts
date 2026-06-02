import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';

/**
 * CSRF guard for state-changing operations (POST/PUT/DELETE/PATCH).
 *
 * Since the app uses httpOnly cookies for auth tokens, CSRF protection is important.
 * This guard checks for either:
 * - An `X-Requested-With` header (set by frontend fetch/axios calls)
 * - A valid `Origin` header matching allowed origins
 *
 * Requests authenticated via JWT Bearer token or API key in headers are exempt,
 * as CSRF only applies to cookie-based authentication.
 */
@Injectable()
export class CsrfGuard implements CanActivate {
  private readonly logger = new Logger(CsrfGuard.name);

  private readonly allowedOrigins: string[] = [
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'https://admin.zimvisit.co.zw',
    'https://gov.zimvisit.co.zw',
    'https://zimvisit.co.zw',
  ];

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const method = req.method?.toUpperCase();

    // Only apply to state-changing methods
    if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      return true;
    }

    // Skip for API key auth — CSRF only matters for cookie-based auth
    const authHeader: string | undefined = req.headers['authorization'];
    const apiKey: string | undefined = req.headers['x-api-key'];
    if (authHeader?.startsWith('Bearer ') || apiKey) {
      return true;
    }

    // Check for X-Requested-With header (standard AJAX indicator)
    const requestedWith = req.headers['x-requested-with'];
    if (requestedWith === 'XMLHttpRequest') {
      return true;
    }

    // Check Origin header against allowed origins
    const origin: string | undefined = req.headers['origin'] || req.headers['referer'];
    if (origin) {
      const isAllowed = this.allowedOrigins.some(
        (allowed) => origin === allowed || origin.startsWith(allowed + '/'),
      );
      if (isAllowed) {
        return true;
      }
    }

    // In development, be more lenient
    if (process.env.NODE_ENV !== 'production') {
      return true;
    }

    this.logger.warn(
      `CSRF violation blocked: ${method} ${req.url} from origin=${origin || 'none'} ip=${req.clientIp || req.ip}`,
    );

    throw new ForbiddenException('CSRF validation failed. Include X-Requested-With header.');
  }
}

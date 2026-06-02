import { Module, Global } from '@nestjs/common';
import { BruteForceGuard } from './brute-force.guard';
import { SanitizationInterceptor } from './sanitization.interceptor';
import { SecurityEventService } from './security-event.service';
import { SecurityController } from './security.controller';

@Global()
@Module({
  providers: [BruteForceGuard, SanitizationInterceptor, SecurityEventService],
  controllers: [SecurityController],
  exports: [BruteForceGuard, SanitizationInterceptor, SecurityEventService],
})
export class SecurityModule {}

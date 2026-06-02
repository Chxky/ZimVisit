import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SecurityEventService } from './security-event.service';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../interfaces/user-role.enum';
import { SecurityEvent } from './security-event.service';

@ApiTags('Security')
@ApiBearerAuth()
@Controller('security')
@Roles(UserRole.ZTA_OFFICIAL, UserRole.ZIMRA_OFFICIAL, UserRole.SYSTEM_ADMIN)
export class SecurityController {
  constructor(private readonly securityEventService: SecurityEventService) {}

  @Get('events')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get recent security events (Government only)' })
  @ApiResponse({ status: 200, description: 'List of recent security events' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  getRecentEvents(
    @Query('limit') limit?: number,
    @Query('type') type?: SecurityEvent['type'],
  ): SecurityEvent[] {
    if (type) {
      return this.securityEventService.getEventsByType(type).slice(-(limit || 100));
    }
    return this.securityEventService.getRecentEvents(limit || 100);
  }

  @Get('threat-summary')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get 24h threat summary (Government only)' })
  @ApiResponse({ status: 200, description: 'Threat summary for the last 24 hours' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  getThreatSummary() {
    return this.securityEventService.getThreatSummary();
  }
}

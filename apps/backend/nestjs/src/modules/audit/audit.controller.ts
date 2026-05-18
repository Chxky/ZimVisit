import { Controller, Get, Query, Param, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { AuditService, AuditFilters } from './audit.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/interfaces/user-role.enum';

@ApiTags('Audit Trail')
@ApiBearerAuth('access-token')
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles(UserRole.ZTA_OFFICIAL, UserRole.ZIMRA_OFFICIAL, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'List audit logs with filters (government only)' })
  @ApiQuery({ name: 'action', required: false, description: 'Filter by action type' })
  @ApiQuery({ name: 'entityType', required: false, description: 'Filter by entity type (booking, payment, operator, compliance)' })
  @ApiQuery({ name: 'entityId', required: false, description: 'Filter by entity ID' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO 8601)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO 8601)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 50)' })
  async findAll(
    @Query('action') action?: string,
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
    @Query('userId') userId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const filters: AuditFilters = {
      action,
      entityType,
      entityId,
      userId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      page: page || 1,
      limit: limit || 50,
    };
    return this.auditService.findAll(filters);
  }

  @Get('entity/:type/:id')
  @Roles(UserRole.ZTA_OFFICIAL, UserRole.ZIMRA_OFFICIAL, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Get audit trail for a specific entity (government only)' })
  async findByEntity(
    @Param('type') entityType: string,
    @Param('id') entityId: string,
  ) {
    return this.auditService.findByEntity(entityType, entityId);
  }

  @Get('user/:userId')
  @Roles(UserRole.ZTA_OFFICIAL, UserRole.ZIMRA_OFFICIAL, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Get audit trail for a specific user (government only)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 50)' })
  async findByUser(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.auditService.findByUser(userId, page || 1, limit || 50);
  }

  @Get('report')
  @Roles(UserRole.ZTA_OFFICIAL, UserRole.ZIMRA_OFFICIAL, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Generate audit summary report (government only)' })
  @ApiQuery({ name: 'action', required: false, description: 'Filter by action type' })
  @ApiQuery({ name: 'entityType', required: false, description: 'Filter by entity type' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO 8601)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO 8601)' })
  async generateReport(
    @Query('action') action?: string,
    @Query('entityType') entityType?: string,
    @Query('userId') userId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters: AuditFilters = {
      action,
      entityType,
      userId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };
    return this.auditService.generateReport(filters);
  }

  @Get('export')
  @Roles(UserRole.ZTA_OFFICIAL, UserRole.ZIMRA_OFFICIAL, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Export audit logs as CSV (government only)' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO 8601)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO 8601)' })
  async exportCsv(
    @Res() res: Response,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters: AuditFilters = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };
    const csv = await this.auditService.exportCsv(filters);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=zimvisit-audit-export.csv');
    res.send(csv);
  }
}

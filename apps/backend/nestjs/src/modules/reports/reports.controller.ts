import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { ReportsService, ReportFilters } from './reports.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/interfaces/user-role.enum';

@ApiTags('Reports')
@ApiBearerAuth('access-token')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('compliance')
  @Roles(UserRole.ZTA_OFFICIAL, UserRole.ZIMRA_OFFICIAL, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Generate compliance summary report (government only)' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO 8601)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO 8601)' })
  @ApiQuery({ name: 'operatorId', required: false, description: 'Filter by operator ID' })
  async getComplianceReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('operatorId') operatorId?: string,
  ) {
    const filters: ReportFilters = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      operatorId,
    };
    return this.reportsService.generateComplianceSummary(filters);
  }

  @Get('revenue')
  @Roles(UserRole.ZTA_OFFICIAL, UserRole.ZIMRA_OFFICIAL, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Generate revenue report with levy, VAT, and BSP fees (government only)' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO 8601)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO 8601)' })
  async getRevenueReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters: ReportFilters = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };
    return this.reportsService.generateRevenueReport(filters);
  }

  @Get('risk')
  @Roles(UserRole.ZTA_OFFICIAL, UserRole.ZIMRA_OFFICIAL, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Generate operator risk assessment report (government only)' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO 8601)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO 8601)' })
  async getRiskReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters: ReportFilters = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };
    return this.reportsService.generateRiskReport(filters);
  }

  @Get('audit-trail')
  @Roles(UserRole.ZTA_OFFICIAL, UserRole.ZIMRA_OFFICIAL, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Generate audit trail report with user attribution (government only)' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO 8601)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO 8601)' })
  async getAuditTrailReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters: ReportFilters = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };
    return this.reportsService.generateAuditTrailReport(filters);
  }

  @Get('export/:type')
  @Roles(UserRole.ZTA_OFFICIAL, UserRole.ZIMRA_OFFICIAL, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Export report as CSV (government only)' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO 8601)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO 8601)' })
  async exportReport(
    @Param('type') type: string,
    @Res() res: Response,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters: ReportFilters = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };
    const csv = await this.reportsService.exportCsv(type, filters);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=zimvisit-${type}-report.csv`);
    res.send(csv);
  }
}

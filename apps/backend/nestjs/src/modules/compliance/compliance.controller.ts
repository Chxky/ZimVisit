import { Controller, Get, Put, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ComplianceService } from './compliance.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/interfaces/user-role.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Compliance')
@ApiBearerAuth('access-token')
@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get('operator/:operatorId')
  @Roles(UserRole.OPERATOR, UserRole.OPERATOR_ADMIN, UserRole.ZTA_OFFICIAL, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Get operator compliance report' })
  async getOperatorCompliance(@Param('operatorId') operatorId: string) {
    return this.complianceService.getOperatorCompliance(operatorId);
  }

  @Get('leakage')
  @Roles(UserRole.ZTA_OFFICIAL, UserRole.ZIMRA_OFFICIAL, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Get revenue leakage analysis (government only)' })
  async getLeakage(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.complianceService.getRevenueLeakage(new Date(startDate), new Date(endDate));
  }

  @Put(':id/review')
  @Roles(UserRole.ZTA_OFFICIAL, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Review a compliance report' })
  async reviewReport(
    @Param('id') id: string,
    @CurrentUser('id') reviewerId: string,
    @Body('notes') notes: string,
  ) {
    return this.complianceService.reviewReport(id, reviewerId, notes);
  }
}

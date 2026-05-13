import { Controller, Get, Post, Put, Param, Body, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OperatorsService } from './operators.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/interfaces/user-role.enum';

@ApiTags('Operators')
@ApiBearerAuth('access-token')
@Controller('operators')
export class OperatorsController {
  constructor(private readonly operatorsService: OperatorsService) {}

  @Get()
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.ZTA_OFFICIAL, UserRole.ZIMRA_OFFICIAL)
  @ApiOperation({ summary: 'List all operators' })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.operatorsService.findAll(page, limit);
  }

  @Get(':id')
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.ZTA_OFFICIAL, UserRole.ZIMRA_OFFICIAL)
  @ApiOperation({ summary: 'Get operator by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.operatorsService.findById(id);
  }

  @Post()
  @Roles(UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Create a new operator' })
  async create(@Body() body: any) {
    return this.operatorsService.create(body);
  }

  @Put(':id')
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.OPERATOR_ADMIN)
  @ApiOperation({ summary: 'Update operator' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    return this.operatorsService.update(id, body);
  }

  @Get('stats/compliance')
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.ZTA_OFFICIAL)
  @ApiOperation({ summary: 'Get operator compliance stats' })
  async getComplianceStats() {
    return this.operatorsService.getComplianceStats();
  }
}

import { Controller, Get, Post, Put, Param, Query, Body, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/interfaces/user-role.enum';

@ApiTags('Bookings')
@ApiBearerAuth('access-token')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get current user bookings' })
  async findByUser(@CurrentUser('id') userId: string, @Query('page') page = 1, @Query('limit') limit = 20) {
    return this.bookingsService.findByUser(userId, page, limit);
  }

  @Get('reference/:ref')
  @ApiOperation({ summary: 'Get booking by reference' })
  async findByReference(@Param('ref') ref: string) {
    return this.bookingsService.findByReference(ref);
  }

  @Get('stats/revenue')
  @Roles(UserRole.ZTA_OFFICIAL, UserRole.ZIMRA_OFFICIAL, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Get revenue statistics (government only)' })
  async getRevenueStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.bookingsService.getRevenueStats(startDate, endDate);
  }

  @Get('stats/compliance')
  @Roles(UserRole.ZTA_OFFICIAL, UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Get compliance statistics (government only)' })
  async getComplianceStats() {
    return this.bookingsService.getComplianceStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingsService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update booking status' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateBookingDto) {
    return this.bookingsService.updateStatus(id, dto);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a booking' })
  async cancel(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('id') userId: string) {
    return this.bookingsService.cancel(id, userId);
  }
}

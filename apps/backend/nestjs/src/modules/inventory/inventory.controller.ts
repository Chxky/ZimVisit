import { Controller, Get, Post, Put, Param, Body, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/interfaces/user-role.enum';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Public()
  @Get('tours')
  @ApiOperation({ summary: 'Search tours' })
  async searchTours(
    @Query('category') category?: string,
    @Query('location') location?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ) {
    return this.inventoryService.findTours({ category, location, minPrice, maxPrice });
  }

  @Public()
  @Get('tours/:id')
  @ApiOperation({ summary: 'Get tour by ID' })
  async getTour(@Param('id', ParseUUIDPipe) id: string) {
    return this.inventoryService.findTourById(id);
  }

  @Public()
  @Get('hotels')
  @ApiOperation({ summary: 'Search hotels' })
  async searchHotels(@Query('city') city?: string) {
    return this.inventoryService.findHotels({ city });
  }

  @Public()
  @Get('hotels/:id')
  @ApiOperation({ summary: 'Get hotel by ID' })
  async getHotel(@Param('id', ParseUUIDPipe) id: string) {
    return this.inventoryService.findHotelById(id);
  }

  @Post('tours')
  @Roles(UserRole.OPERATOR, UserRole.OPERATOR_ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a tour (operator only)' })
  async createTour(@CurrentUser('operatorId') operatorId: string, @Body() dto: CreateTourDto) {
    return this.inventoryService.createTour(operatorId, dto);
  }

  @Put('tours/:id')
  @Roles(UserRole.OPERATOR, UserRole.OPERATOR_ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a tour' })
  async updateTour(@Param('id', ParseUUIDPipe) id: string, @Body() dto: Partial<CreateTourDto>) {
    return this.inventoryService.updateTour(id, dto);
  }

  @Post('hotels')
  @Roles(UserRole.OPERATOR, UserRole.OPERATOR_ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a hotel (operator only)' })
  async createHotel(@CurrentUser('operatorId') operatorId: string, @Body() dto: CreateHotelDto) {
    return this.inventoryService.createHotel(operatorId, dto);
  }

  @Put('hotels/:id')
  @Roles(UserRole.OPERATOR, UserRole.OPERATOR_ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a hotel' })
  async updateHotel(@Param('id', ParseUUIDPipe) id: string, @Body() dto: Partial<CreateHotelDto>) {
    return this.inventoryService.updateHotel(id, dto);
  }
}

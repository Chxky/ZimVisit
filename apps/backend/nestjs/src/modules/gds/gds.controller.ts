import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GdsService } from './gds.service';
import { SearchFlightsDto } from './dto/search-flights.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('GDS / Flights')
@Controller('gds')
export class GdsController {
  constructor(private readonly gdsService: GdsService) {}

  @Public()
  @Get('flights/search')
  @ApiOperation({ summary: 'Search flights via GDS aggregator' })
  async searchFlights(@Query() dto: SearchFlightsDto) {
    return this.gdsService.searchFlights(dto);
  }

  @Post('flights/book')
  @ApiOperation({ summary: 'Book a flight via GDS' })
  async bookFlight(@Body() body: any) {
    return this.gdsService.bookFlight(body, body.provider || 'amadeus');
  }
}

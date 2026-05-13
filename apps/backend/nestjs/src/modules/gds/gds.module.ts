import { Module } from '@nestjs/common';
import { GdsController } from './gds.controller';
import { GdsService } from './gds.service';
import { TravelportService } from './services/travelport.service';
import { AmadeusService } from './services/amadeus.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [GdsController],
  providers: [GdsService, TravelportService, AmadeusService],
  exports: [GdsService],
})
export class GdsModule {}

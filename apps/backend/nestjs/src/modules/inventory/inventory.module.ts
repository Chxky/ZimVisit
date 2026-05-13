import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { Tour } from './entities/tour.entity';
import { Hotel } from './entities/hotel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tour, Hotel])],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}

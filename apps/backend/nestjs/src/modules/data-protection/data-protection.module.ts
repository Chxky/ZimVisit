import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataProtectionController } from './data-protection.controller';
import { DataProtectionService } from './data-protection.service';
import { UserConsent } from './entities/consent.entity';
import { User } from '../users/entities/user.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Payment } from '../payments/entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserConsent, User, Booking, Payment]),
  ],
  controllers: [DataProtectionController],
  providers: [DataProtectionService],
  exports: [DataProtectionService],
})
export class DataProtectionModule {}

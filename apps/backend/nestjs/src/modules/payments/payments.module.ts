import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Payment } from './entities/payment.entity';
import { PaynowProvider } from './providers/paynow.provider';
import { EcocashProvider } from './providers/ecocash.provider';
import { StripeProvider } from './providers/stripe.provider';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), BookingsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaynowProvider, EcocashProvider, StripeProvider],
  exports: [PaymentsService],
})
export class PaymentsModule {}

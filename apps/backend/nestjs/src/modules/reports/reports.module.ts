import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ComplianceReport } from '../compliance/entities/compliance-report.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Operator } from '../operators/entities/operator.entity';
import { Tour } from '../inventory/entities/tour.entity';
import { Payment } from '../payments/entities/payment.entity';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ComplianceReport, Booking, Operator, Tour, Payment]),
    AuditModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}

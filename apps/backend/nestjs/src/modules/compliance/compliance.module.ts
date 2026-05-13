import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplianceController } from './compliance.controller';
import { ComplianceService } from './compliance.service';
import { ComplianceReport } from './entities/compliance-report.entity';
import { BspEngineService } from './services/bsp-engine.service';
import { LevyCalculatorService } from './services/levy-calculator.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([ComplianceReport]), HttpModule],
  controllers: [ComplianceController],
  providers: [ComplianceService, BspEngineService, LevyCalculatorService],
  exports: [ComplianceService],
})
export class ComplianceModule {}

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ComplianceReport, ComplianceStatus } from './entities/compliance-report.entity';
import { BspEngineService } from './services/bsp-engine.service';
import { LevyCalculatorService } from './services/levy-calculator.service';

@Injectable()
export class ComplianceService {
  private readonly logger = new Logger(ComplianceService.name);

  constructor(
    @InjectRepository(ComplianceReport)
    private readonly reportRepo: Repository<ComplianceReport>,
    private readonly bspEngine: BspEngineService,
    private readonly levyCalculator: LevyCalculatorService,
  ) {}

  async checkBookingCompliance(bookingId: string, booking: any): Promise<ComplianceReport> {
    const levyAmount = this.levyCalculator.calculateLevy(booking.totalAmount);
    const vatAmount = this.levyCalculator.calculateVAT(booking.totalAmount);
    const bspFee = this.levyCalculator.calculateBSPFee(booking.totalAmount);

    const bspResult = await this.bspEngine.routeBooking(booking);

    const report = this.reportRepo.create({
      id: uuidv4(),
      bookingId,
      operatorId: booking.operatorId,
      levyAmount,
      vatAmount,
      bspFee,
      bspRouted: bspResult.success,
      bspReference: bspResult.reference,
      taxesRemitted: true,
      levyRemitted: true,
      isCompliant: bspResult.success,
      status: bspResult.success ? ComplianceStatus.COMPLIANT : ComplianceStatus.FLAGGED,
      auditTrail: {
        checkedAt: new Date().toISOString(),
        bookingTotal: booking.totalAmount,
        levyRate: process.env.TOURISM_LEVY_RATE,
        vatRate: process.env.VAT_RATE,
        bspResult,
      },
    });

    return this.reportRepo.save(report);
  }

  async getOperatorCompliance(operatorId: string) {
    const reports = await this.reportRepo.find({
      where: { operatorId },
      order: { createdAt: 'DESC' },
      take: 100,
    });

    const total = reports.length;
    const compliant = reports.filter((r) => r.isCompliant).length;
    const flagged = reports.filter((r) => r.status === ComplianceStatus.FLAGGED).length;

    return {
      operatorId,
      totalReports: total,
      compliant,
      nonCompliant: total - compliant,
      flagged,
      complianceRate: total > 0 ? (compliant / total) * 100 : 0,
      recentReports: reports.slice(0, 10),
    };
  }

  async getAllOperatorsCompliance(operatorIds: string[]) {
    const results = [];
    for (const id of operatorIds) {
      const stats = await this.getOperatorCompliance(id);
      results.push(stats);
    }
    return results;
  }

  async getRevenueLeakage(startDate: Date, endDate: Date) {
    const reports = await this.reportRepo.find({
      where: {
        createdAt: Between(startDate, endDate),
        isCompliant: false,
      },
    });

    const totalLeakage = reports.reduce((sum, r) => sum + Number(r.levyAmount) + Number(r.vatAmount), 0);
    return {
      period: { startDate, endDate },
      nonCompliantBookings: reports.length,
      estimatedLeakage: totalLeakage,
      reports,
    };
  }

  async reviewReport(id: string, reviewerId: string, notes: string) {
    const report = await this.reportRepo.findOne({ where: { id } });
    if (!report) throw new NotFoundException('Report not found');

    report.reviewedAt = new Date();
    report.reviewedBy = reviewerId;
    report.notes = notes;
    report.status = ComplianceStatus.COMPLIANT;
    report.isCompliant = true;

    return this.reportRepo.save(report);
  }

  async findByBookingId(bookingId: string): Promise<ComplianceReport | null> {
    return this.reportRepo.findOne({ where: { bookingId } });
  }
}

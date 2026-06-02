import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComplianceReport, ComplianceStatus } from '../compliance/entities/compliance-report.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { BookingStatus } from '../bookings/dto/booking-status.enum';
import { Operator } from '../operators/entities/operator.entity';
import { Tour } from '../inventory/entities/tour.entity';
import { Payment } from '../payments/entities/payment.entity';
import { AuditService } from '../audit/audit.service';

export interface ReportFilters {
  startDate?: Date;
  endDate?: Date;
  operatorId?: string;
}

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    @InjectRepository(ComplianceReport)
    private readonly complianceRepo: Repository<ComplianceReport>,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Operator)
    private readonly operatorRepo: Repository<Operator>,
    @InjectRepository(Tour)
    private readonly tourRepo: Repository<Tour>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    private readonly auditService: AuditService,
  ) {}

  async generateComplianceSummary(filters: ReportFilters) {
    const { startDate, endDate, operatorId } = filters;

    const complianceQuery = this.complianceRepo.createQueryBuilder('report');
    if (startDate && endDate) {
      complianceQuery.andWhere('report.createdAt BETWEEN :start AND :end', { start: startDate, end: endDate });
    }
    if (operatorId) {
      complianceQuery.andWhere('report.operatorId = :operatorId', { operatorId });
    }

    const reports = await complianceQuery.getMany();

    const total = reports.length;
    const compliant = reports.filter((r) => r.isCompliant).length;
    const flagged = reports.filter((r) => r.status === ComplianceStatus.FLAGGED).length;
    const pendingReview = reports.filter((r) => r.status === ComplianceStatus.PENDING_REVIEW).length;

    const operatorStats: Record<string, { total: number; compliant: number; flagged: number }> = {};
    for (const report of reports) {
      const opId = report.operatorId || 'unknown';
      if (!operatorStats[opId]) {
        operatorStats[opId] = { total: 0, compliant: 0, flagged: 0 };
      }
      operatorStats[opId].total++;
      if (report.isCompliant) operatorStats[opId].compliant++;
      if (report.status === ComplianceStatus.FLAGGED) operatorStats[opId].flagged++;
    }

    const operatorComplianceRates = Object.entries(operatorStats).map(([opId, stats]) => ({
      operatorId: opId,
      totalReviews: stats.total,
      compliant: stats.compliant,
      flagged: stats.flagged,
      complianceRate: stats.total > 0 ? Math.round((stats.compliant / stats.total) * 100 * 100) / 100 : 0,
    }));

    const lastAuditDates = reports
      .filter((r) => r.reviewedAt)
      .sort((a, b) => new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime())
      .slice(0, 10)
      .map((r) => ({
        operatorId: r.operatorId,
        reportId: r.id,
        reviewedAt: r.reviewedAt,
        reviewedBy: r.reviewedBy,
      }));

    return {
      period: { startDate, endDate },
      summary: {
        totalReviews: total,
        compliant,
        nonCompliant: total - compliant,
        flagged,
        pendingReview,
        overallComplianceRate: total > 0 ? Math.round((compliant / total) * 100 * 100) / 100 : 0,
      },
      operatorComplianceRates,
      recentAudits: lastAuditDates,
    };
  }

  async generateRevenueReport(filters: ReportFilters) {
    const { startDate, endDate } = filters;

    const bookingQuery = this.bookingRepo.createQueryBuilder('booking')
      .where('booking.status != :cancelled', { cancelled: BookingStatus.CANCELLED });

    if (startDate && endDate) {
      bookingQuery.andWhere('booking.createdAt BETWEEN :start AND :end', { start: startDate, end: endDate });
    }

    const bookings = await bookingQuery.getMany();

    const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.totalAmount), 0);
    const totalLevy = bookings.reduce((sum, b) => sum + Number(b.levyAmount), 0);
    const totalVat = bookings.reduce((sum, b) => sum + Number(b.taxAmount), 0);
    const totalBspFees = bookings.reduce((sum, b) => sum + Number(b.platformFee), 0);
    const totalNet = bookings.reduce((sum, b) => sum + Number(b.netAmount), 0);

    const compliantBookings = bookings.filter((b) => b.isCompliant);
    const nonCompliantBookings = bookings.filter((b) => !b.isCompliant);
    const estimatedLeakage = nonCompliantBookings.reduce(
      (sum, b) => sum + Number(b.levyAmount) + Number(b.taxAmount),
      0,
    );

    const monthlyBreakdown: Record<string, { revenue: number; levy: number; vat: number }> = {};
    for (const booking of bookings) {
      const month = new Date(booking.createdAt).toISOString().substring(0, 7);
      if (!monthlyBreakdown[month]) {
        monthlyBreakdown[month] = { revenue: 0, levy: 0, vat: 0 };
      }
      monthlyBreakdown[month].revenue += Number(booking.totalAmount);
      monthlyBreakdown[month].levy += Number(booking.levyAmount);
      monthlyBreakdown[month].vat += Number(booking.taxAmount);
    }

    return {
      period: { startDate, endDate },
      summary: {
        totalBookings: bookings.length,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalLevyCollected: Math.round(totalLevy * 100) / 100,
        totalVatCollected: Math.round(totalVat * 100) / 100,
        totalBspFees: Math.round(totalBspFees * 100) / 100,
        totalNetAmount: Math.round(totalNet * 100) / 100,
        estimatedLeakage: Math.round(estimatedLeakage * 100) / 100,
        compliantBookings: compliantBookings.length,
        nonCompliantBookings: nonCompliantBookings.length,
      },
      monthlyBreakdown,
    };
  }

  async generateRiskReport(filters: ReportFilters) {
    const { startDate, endDate } = filters;

    const operators = await this.operatorRepo.find();

    const riskOperators = [];
    for (const operator of operators) {
      const complianceQuery = this.complianceRepo.createQueryBuilder('report')
        .where('report.operatorId = :operatorId', { operatorId: operator.id });

      if (startDate && endDate) {
        complianceQuery.andWhere('report.createdAt BETWEEN :start AND :end', { start: startDate, end: endDate });
      }

      const reports = await complianceQuery.getMany();
      const total = reports.length;
      const flagged = reports.filter((r) => r.status === ComplianceStatus.FLAGGED).length;
      const nonCompliant = reports.filter((r) => !r.isCompliant).length;

      const complianceRate = total > 0 ? (total - nonCompliant) / total : 1;
      const flagRate = total > 0 ? flagged / total : 0;

      const riskScore = Math.round(((1 - complianceRate) * 60 + flagRate * 40) * 100) / 100;

      const predictedLeakage = reports
        .filter((r) => !r.isCompliant)
        .reduce((sum, r) => sum + Number(r.levyAmount) + Number(r.vatAmount), 0);

      const recommendedActions: string[] = [];
      if (riskScore > 50) {
        recommendedActions.push('Immediate compliance audit required');
        recommendedActions.push('Suspend operator pending review');
      } else if (riskScore > 30) {
        recommendedActions.push('Schedule compliance review within 30 days');
        recommendedActions.push('Request updated documentation');
      } else if (riskScore > 10) {
        recommendedActions.push('Monitor operator activity closely');
      } else {
        recommendedActions.push('No action required - operator is compliant');
      }

      riskOperators.push({
        operatorId: operator.id,
        operatorName: operator.businessName,
        status: operator.status,
        riskScore,
        complianceRate: Math.round(complianceRate * 100 * 100) / 100,
        totalReviews: total,
        flaggedReviews: flagged,
        nonCompliantReviews: nonCompliant,
        predictedLeakage: Math.round(predictedLeakage * 100) / 100,
        recommendedActions,
      });
    }

    riskOperators.sort((a, b) => b.riskScore - a.riskScore);

    return {
      period: { startDate, endDate },
      generatedAt: new Date().toISOString(),
      totalOperators: operators.length,
      highRisk: riskOperators.filter((o) => o.riskScore > 50).length,
      mediumRisk: riskOperators.filter((o) => o.riskScore > 10 && o.riskScore <= 50).length,
      lowRisk: riskOperators.filter((o) => o.riskScore <= 10).length,
      operators: riskOperators,
    };
  }

  async generateAuditTrailReport(filters: ReportFilters) {
    const { startDate, endDate } = filters;

    const auditLogs = await this.auditService.findByDateRange(
      startDate || new Date(0),
      endDate || new Date(),
    );

    const actionCounts: Record<string, number> = {};
    const userActivity: Record<string, { count: number; actions: string[] }> = {};
    const entityActivity: Record<string, number> = {};

    for (const log of auditLogs) {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
      entityActivity[log.entityType] = (entityActivity[log.entityType] || 0) + 1;

      if (log.userEmail) {
        if (!userActivity[log.userEmail]) {
          userActivity[log.userEmail] = { count: 0, actions: [] };
        }
        userActivity[log.userEmail].count++;
        if (!userActivity[log.userEmail].actions.includes(log.action)) {
          userActivity[log.userEmail].actions.push(log.action);
        }
      }
    }

    const topUsers = Object.entries(userActivity)
      .map(([email, data]) => ({ email, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      period: { startDate, endDate },
      generatedAt: new Date().toISOString(),
      totalActions: auditLogs.length,
      actionBreakdown: actionCounts,
      entityBreakdown: entityActivity,
      topUsers,
      recentActions: auditLogs.slice(0, 20),
    };
  }

  async exportCsv(type: string, filters: ReportFilters): Promise<string> {
    switch (type) {
      case 'compliance':
        return this.exportComplianceCsv(filters);
      case 'revenue':
        return this.exportRevenueCsv(filters);
      case 'risk':
        return this.exportRiskCsv(filters);
      case 'audit-trail':
        return this.exportAuditTrailCsv(filters);
      default:
        throw new Error(`Unknown report type: ${type}`);
    }
  }

  async generateEconomicImpact(): Promise<any> {
    const tourCount = await this.tourRepo.count();
    const operatorCount = await this.operatorRepo.count();
    const bookingCount = await this.bookingRepo.count();
    return {
      totalTours: tourCount,
      totalOperators: operatorCount,
      totalBookings: bookingCount,
      directJobsSupported: Math.round(operatorCount * 12.5),
      indirectJobsSupported: Math.round(operatorCount * 8.3),
      localCommunityBenefit: Math.round(bookingCount * 45),
      estimatedAnnualRevenue: bookingCount * 1850,
    };
  }

  async generatePlatformStats(): Promise<any> {
    const tourCount = await this.tourRepo.count();
    const operatorCount = await this.operatorRepo.count();
    const bookingCount = await this.bookingRepo.count();
    return {
      totalTours: tourCount,
      totalOperators: operatorCount,
      totalBookings: bookingCount,
      totalUsers: 1,
      activeTours: tourCount,
      featuredTours: Math.round(tourCount * 0.3),
      averageTourPrice: 185,
    };
  }

  private async exportComplianceCsv(filters: ReportFilters): Promise<string> {
    const report = await this.generateComplianceSummary(filters);
    const header = 'OperatorId,TotalReviews,Compliant,Flagged,ComplianceRate\n';
    const rows = report.operatorComplianceRates.map((o) =>
      `"${o.operatorId}",${o.totalReviews},${o.compliant},${o.flagged},${o.complianceRate}`,
    ).join('\n');
    return header + rows;
  }

  private async exportRevenueCsv(filters: ReportFilters): Promise<string> {
    const report = await this.generateRevenueReport(filters);
    const header = 'Period,TotalBookings,TotalRevenue,LevyCollected,VatCollected,BspFees,EstimatedLeakage\n';
    const row = `"${report.period.startDate || 'All'} - ${report.period.endDate || 'All'}",${report.summary.totalBookings},${report.summary.totalRevenue},${report.summary.totalLevyCollected},${report.summary.totalVatCollected},${report.summary.totalBspFees},${report.summary.estimatedLeakage}`;
    return header + row;
  }

  private async exportRiskCsv(filters: ReportFilters): Promise<string> {
    const report = await this.generateRiskReport(filters);
    const header = 'OperatorId,OperatorName,RiskScore,ComplianceRate,FlaggedReviews,PredictedLeakage,Status\n';
    const rows = report.operators.map((o) =>
      `"${o.operatorId}","${o.operatorName}",${o.riskScore},${o.complianceRate},${o.flaggedReviews},${o.predictedLeakage},"${o.status}"`,
    ).join('\n');
    return header + rows;
  }

  private async exportAuditTrailCsv(filters: ReportFilters): Promise<string> {
    const report = await this.generateAuditTrailReport(filters);
    const header = 'Action,EntityType,UserEmail,Count\n';
    const rows = report.topUsers.flatMap((user) =>
      user.actions.map((action) => `"${action}","-","${user.email}",${user.count}`),
    ).join('\n');
    return header + rows;
  }
}

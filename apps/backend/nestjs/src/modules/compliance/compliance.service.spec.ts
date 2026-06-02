import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ComplianceService } from './compliance.service';
import { ComplianceReport, ComplianceStatus } from './entities/compliance-report.entity';
import { BspEngineService } from './services/bsp-engine.service';
import { LevyCalculatorService } from './services/levy-calculator.service';

describe('ComplianceService', () => {
  let service: ComplianceService;
  let reportRepoMock: any;
  let bspEngineMock: any;
  let levyCalculatorMock: any;

  const mockReport = {
    id: 'report-1',
    bookingId: 'booking-1',
    operatorId: 'operator-1',
    isCompliant: true,
    status: ComplianceStatus.COMPLIANT,
    levyAmount: 20,
    vatAmount: 150,
    bspFee: 30,
    bspRouted: true,
    bspReference: 'BSP-REF-123',
    taxesRemitted: true,
    levyRemitted: true,
    auditTrail: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    reportRepoMock = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    };

    bspEngineMock = {
      routeBooking: jest.fn(),
    };

    levyCalculatorMock = {
      calculateLevy: jest.fn(),
      calculateVAT: jest.fn(),
      calculateBSPFee: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComplianceService,
        { provide: getRepositoryToken(ComplianceReport), useValue: reportRepoMock },
        { provide: BspEngineService, useValue: bspEngineMock },
        { provide: LevyCalculatorService, useValue: levyCalculatorMock },
      ],
    }).compile();

    service = module.get<ComplianceService>(ComplianceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkBookingCompliance', () => {
    it('should create compliant report when BSP succeeds', async () => {
      levyCalculatorMock.calculateLevy.mockReturnValue(20);
      levyCalculatorMock.calculateVAT.mockReturnValue(150);
      levyCalculatorMock.calculateBSPFee.mockReturnValue(30);
      bspEngineMock.routeBooking.mockResolvedValue({ success: true, reference: 'BSP-REF-123' });
      reportRepoMock.create.mockReturnValue(mockReport);
      reportRepoMock.save.mockResolvedValue(mockReport);

      const booking = { totalAmount: 1000, operatorId: 'operator-1', bookingReference: 'ZV123' };
      const result = await service.checkBookingCompliance('booking-1', booking);

      expect(result.isCompliant).toBe(true);
      expect(result.status).toBe(ComplianceStatus.COMPLIANT);
      expect(bspEngineMock.routeBooking).toHaveBeenCalledWith(booking);
    });

    it('should create flagged report when BSP fails', async () => {
      levyCalculatorMock.calculateLevy.mockReturnValue(20);
      levyCalculatorMock.calculateVAT.mockReturnValue(150);
      levyCalculatorMock.calculateBSPFee.mockReturnValue(30);
      bspEngineMock.routeBooking.mockResolvedValue({ success: false, error: 'BSP unavailable' });

      const flaggedReport = { ...mockReport, isCompliant: false, status: ComplianceStatus.FLAGGED, bspRouted: false };
      reportRepoMock.create.mockReturnValue(flaggedReport);
      reportRepoMock.save.mockResolvedValue(flaggedReport);

      const booking = { totalAmount: 1000, operatorId: 'operator-1', bookingReference: 'ZV123' };
      const result = await service.checkBookingCompliance('booking-1', booking);

      expect(result.isCompliant).toBe(false);
      expect(result.status).toBe(ComplianceStatus.FLAGGED);
    });
  });

  describe('getOperatorCompliance', () => {
    it('should return compliance stats with compliance rate', async () => {
      const reports = [
        { ...mockReport, isCompliant: true, status: ComplianceStatus.COMPLIANT },
        { ...mockReport, id: 'report-2', isCompliant: true, status: ComplianceStatus.COMPLIANT },
        { ...mockReport, id: 'report-3', isCompliant: false, status: ComplianceStatus.FLAGGED },
      ];
      reportRepoMock.find.mockResolvedValue(reports);

      const result = await service.getOperatorCompliance('operator-1');

      expect(result.totalReports).toBe(3);
      expect(result.compliant).toBe(2);
      expect(result.nonCompliant).toBe(1);
      expect(result.flagged).toBe(1);
      expect(result.complianceRate).toBeCloseTo(66.67, 1);
    });
  });

  describe('getRevenueLeakage', () => {
    it('should return non-compliant reports sum', async () => {
      const nonCompliantReports = [
        { ...mockReport, isCompliant: false, levyAmount: 20, vatAmount: 150 },
        { ...mockReport, id: 'report-2', isCompliant: false, levyAmount: 30, vatAmount: 200 },
      ];
      reportRepoMock.find.mockResolvedValue(nonCompliantReports);

      const startDate = new Date('2026-01-01');
      const endDate = new Date('2026-12-31');
      const result = await service.getRevenueLeakage(startDate, endDate);

      expect(result.nonCompliantBookings).toBe(2);
      expect(result.estimatedLeakage).toBe(400); // (20+150) + (30+200)
      expect(result.period.startDate).toBe(startDate);
      expect(result.period.endDate).toBe(endDate);
    });
  });

  describe('reviewReport', () => {
    it('should mark report as compliant', async () => {
      const pendingReport = { ...mockReport, status: ComplianceStatus.FLAGGED, isCompliant: false };
      reportRepoMock.findOne.mockResolvedValue(pendingReport);
      reportRepoMock.save.mockImplementation((r: any) => Promise.resolve(r));

      const result = await service.reviewReport('report-1', 'reviewer-1', 'All good');

      expect(result.status).toBe(ComplianceStatus.COMPLIANT);
      expect(result.isCompliant).toBe(true);
      expect(result.reviewedBy).toBe('reviewer-1');
      expect(result.notes).toBe('All good');
    });

    it('should throw error when report not found', async () => {
      reportRepoMock.findOne.mockResolvedValue(null);

      await expect(service.reviewReport('nonexistent', 'reviewer-1', 'notes')).rejects.toThrow('Report not found');
    });
  });

  describe('findByBookingId', () => {
    it('should return report when found', async () => {
      reportRepoMock.findOne.mockResolvedValue(mockReport);

      const result = await service.findByBookingId('booking-1');

      expect(result).toEqual(mockReport);
    });

    it('should return null when not found', async () => {
      reportRepoMock.findOne.mockResolvedValue(null);

      const result = await service.findByBookingId('nonexistent');

      expect(result).toBeNull();
    });
  });
});

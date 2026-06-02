import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuditService } from './audit.service';
import { AuditLog } from './audit.entity';

describe('AuditService', () => {
  let service: AuditService;
  let auditRepoMock: any;

  const mockAuditLog = {
    id: 'audit-1',
    action: 'UPDATE',
    entityType: 'booking',
    entityId: 'booking-1',
    userId: 'user-1',
    userEmail: 'test@example.com',
    changes: { status: { old: 'pending', new: 'confirmed' } },
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0',
    timestamp: new Date('2026-05-15T10:00:00Z'),
  };

  beforeEach(async () => {
    auditRepoMock = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findAndCount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        { provide: getRepositoryToken(AuditLog), useValue: auditRepoMock },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('log', () => {
    it('should create and save an audit entry', async () => {
      auditRepoMock.create.mockReturnValue(mockAuditLog);
      auditRepoMock.save.mockResolvedValue(mockAuditLog);

      const result = await service.log(
        'UPDATE',
        'booking',
        'booking-1',
        'user-1',
        'test@example.com',
        { status: { old: 'pending', new: 'confirmed' } },
        '127.0.0.1',
        'Mozilla/5.0',
      );

      expect(auditRepoMock.create).toHaveBeenCalledWith({
        action: 'UPDATE',
        entityType: 'booking',
        entityId: 'booking-1',
        userId: 'user-1',
        userEmail: 'test@example.com',
        changes: { status: { old: 'pending', new: 'confirmed' } },
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
      });
      expect(result).toEqual(mockAuditLog);
    });
  });

  describe('findAll', () => {
    it('should apply filters and return paginated results', async () => {
      auditRepoMock.findAndCount.mockResolvedValue([[mockAuditLog], 1]);

      const result = await service.findAll({
        action: 'UPDATE',
        entityType: 'booking',
        page: 1,
        limit: 50,
      });

      expect(result.items).toEqual([mockAuditLog]);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(50);
    });

    it('should apply date range filter when startDate and endDate provided', async () => {
      auditRepoMock.findAndCount.mockResolvedValue([[mockAuditLog], 1]);

      const startDate = new Date('2026-01-01');
      const endDate = new Date('2026-12-31');

      await service.findAll({ startDate, endDate, page: 1, limit: 50 });

      expect(auditRepoMock.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            timestamp: expect.anything(),
          }),
        }),
      );
    });
  });

  describe('findByEntity', () => {
    it('should return logs for a specific entity', async () => {
      auditRepoMock.find.mockResolvedValue([mockAuditLog]);

      const result = await service.findByEntity('booking', 'booking-1');

      expect(result).toEqual([mockAuditLog]);
      expect(auditRepoMock.find).toHaveBeenCalledWith({
        where: { entityType: 'booking', entityId: 'booking-1' },
        order: { timestamp: 'DESC' },
      });
    });
  });

  describe('findByUser', () => {
    it('should return paginated user logs', async () => {
      auditRepoMock.findAndCount.mockResolvedValue([[mockAuditLog], 1]);

      const result = await service.findByUser('user-1', 1, 50);

      expect(result.items).toEqual([mockAuditLog]);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(50);
    });
  });

  describe('findByDateRange', () => {
    it('should return logs in the specified date range', async () => {
      auditRepoMock.find.mockResolvedValue([mockAuditLog]);

      const startDate = new Date('2026-01-01');
      const endDate = new Date('2026-12-31');
      const result = await service.findByDateRange(startDate, endDate);

      expect(result).toEqual([mockAuditLog]);
    });
  });

  describe('generateReport', () => {
    it('should return breakdown stats', async () => {
      const logs = [
        { ...mockAuditLog, action: 'CREATE', entityType: 'booking', userEmail: 'user1@example.com', timestamp: new Date('2026-05-15T10:00:00Z') },
        { ...mockAuditLog, id: 'audit-2', action: 'UPDATE', entityType: 'payment', userEmail: 'user2@example.com', timestamp: new Date('2026-05-15T14:00:00Z') },
        { ...mockAuditLog, id: 'audit-3', action: 'CREATE', entityType: 'booking', userEmail: 'user1@example.com', timestamp: new Date('2026-05-15T18:00:00Z') },
      ];
      auditRepoMock.find.mockResolvedValue(logs);

      const result = await service.generateReport({
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
      });

      expect(result.totalEntries).toBe(3);
      expect(result.actionBreakdown).toEqual({ CREATE: 2, UPDATE: 1 });
      expect(result.entityBreakdown).toEqual({ booking: 2, payment: 1 });
      expect(result.userBreakdown).toEqual({ 'user1@example.com': 2, 'user2@example.com': 1 });
      expect(result.hourlyDistribution).toBeDefined();
    });
  });

  describe('exportCsv', () => {
    it('should return CSV string', async () => {
      auditRepoMock.find.mockResolvedValue([mockAuditLog]);

      const result = await service.exportCsv({
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
      });

      expect(result).toContain('ID,Action,EntityType,EntityId,UserId,UserEmail,IpAddress,UserAgent,Timestamp');
      expect(result).toContain('UPDATE');
      expect(result).toContain('booking');
      expect(result).toContain('test@example.com');
    });
  });
});

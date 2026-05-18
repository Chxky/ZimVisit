import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { AuditLog } from './audit.entity';

export interface AuditFilters {
  action?: string;
  entityType?: string;
  entityId?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
  ) {}

  async log(
    action: string,
    entityType: string,
    entityId: string,
    userId: string,
    userEmail: string,
    changes: Record<string, { old: any; new: any }>,
    ipAddress: string,
    userAgent: string,
  ): Promise<AuditLog> {
    const entry = this.auditRepo.create({
      action,
      entityType,
      entityId,
      userId,
      userEmail,
      changes,
      ipAddress,
      userAgent,
    });

    const saved = await this.auditRepo.save(entry);
    this.logger.log(`Audit: ${action} on ${entityType}/${entityId} by ${userEmail}`);
    return saved;
  }

  async findAll(filters: AuditFilters) {
    const { action, entityType, entityId, userId, startDate, endDate, page = 1, limit = 50 } = filters;

    const where: FindOptionsWhere<AuditLog> = {};
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;
    if (userId) where.userId = userId;
    if (startDate && endDate) {
      where.timestamp = Between(startDate, endDate);
    }

    const [items, total] = await this.auditRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { timestamp: 'DESC' },
    });

    return { items, total, page, limit };
  }

  async findByEntity(entityType: string, entityId: string): Promise<AuditLog[]> {
    return this.auditRepo.find({
      where: { entityType, entityId },
      order: { timestamp: 'DESC' },
    });
  }

  async findByUser(userId: string, page = 1, limit = 50) {
    const [items, total] = await this.auditRepo.findAndCount({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
      order: { timestamp: 'DESC' },
    });

    return { items, total, page, limit };
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]> {
    return this.auditRepo.find({
      where: {
        timestamp: Between(startDate, endDate),
      },
      order: { timestamp: 'DESC' },
    });
  }

  async generateReport(filters: AuditFilters) {
    const { action, entityType, userId, startDate, endDate } = filters;

    const where: FindOptionsWhere<AuditLog> = {};
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;
    if (userId) where.userId = userId;
    if (startDate && endDate) {
      where.timestamp = Between(startDate, endDate);
    }

    const logs = await this.auditRepo.find({ where, order: { timestamp: 'DESC' } });

    const actionCounts: Record<string, number> = {};
    const entityCounts: Record<string, number> = {};
    const userCounts: Record<string, number> = {};
    const hourlyDistribution: Record<string, number> = {};

    for (const log of logs) {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
      entityCounts[log.entityType] = (entityCounts[log.entityType] || 0) + 1;
      if (log.userEmail) {
        userCounts[log.userEmail] = (userCounts[log.userEmail] || 0) + 1;
      }
      const hour = new Date(log.timestamp).getHours().toString();
      hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + 1;
    }

    return {
      totalEntries: logs.length,
      period: { startDate, endDate },
      actionBreakdown: actionCounts,
      entityBreakdown: entityCounts,
      userBreakdown: userCounts,
      hourlyDistribution,
    };
  }

  async exportCsv(filters: AuditFilters): Promise<string> {
    const logs = await this.findByDateRange(
      filters.startDate || new Date(0),
      filters.endDate || new Date(),
    );

    const header = 'ID,Action,EntityType,EntityId,UserId,UserEmail,IpAddress,UserAgent,Timestamp\n';
    const rows = logs.map((log) =>
      `"${log.id}","${log.action}","${log.entityType}","${log.entityId || ''}","${log.userId || ''}","${log.userEmail || ''}","${log.ipAddress || ''}","${log.userAgent || ''}","${log.timestamp}"`,
    ).join('\n');

    return header + rows;
  }
}

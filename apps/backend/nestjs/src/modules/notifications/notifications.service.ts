import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notifRepo: Repository<Notification>,
  ) {}

  async create(dto: Partial<Notification>): Promise<Notification> {
    const notif = this.notifRepo.create(dto);
    return this.notifRepo.save(notif);
  }

  async findByUser(userId: string, page = 1, limit = 50) {
    const [items, total] = await this.notifRepo.findAndCount({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { items, total };
  }

  async markAsRead(id: string): Promise<void> {
    await this.notifRepo.update(id, { isRead: true });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notifRepo.update({ userId, isRead: false }, { isRead: true });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notifRepo.count({ where: { userId, isRead: false } });
  }
}

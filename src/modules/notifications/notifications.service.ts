import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../domain/entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepo: Repository<Notification>,
  ) {}

  async findAll(userId: string, query: any) {
    // TODO: filter by type, isRead; pagination
    return this.notificationsRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async markRead(id: string, userId: string) {
    await this.notificationsRepo.update({ id, userId }, { isRead: true });
    return { message: 'Marked as read' };
  }

  async markAllRead(userId: string) {
    await this.notificationsRepo.update({ userId, isRead: false }, { isRead: true });
    return { message: 'All marked as read' };
  }

  async create(
    userId: string,
    type: string,
    title: string,
    body: string,
    data?: Record<string, any>,
  ) {
    const notification = this.notificationsRepo.create({ userId, type, title, body, data });
    return this.notificationsRepo.save(notification);
  }
}

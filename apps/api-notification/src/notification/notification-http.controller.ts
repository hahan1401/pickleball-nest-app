import { Controller, Get, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationHttpController {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * Called by api-gateway on WebSocket connect to flush undelivered notifications.
   * Marks all returned notifications as delivered.
   */
  @Get('pending/:userId')
  @HttpCode(HttpStatus.OK)
  flushPending(@Param('userId') userId: string) {
    return this.notificationService.flushPending(userId);
  }

  @Get('inbox/:userId')
  getInbox(@Param('userId') userId: string) {
    return this.notificationService.getInbox(userId);
  }

  @Patch(':id/read/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  markRead(@Param('id') id: string, @Param('userId') userId: string) {
    return this.notificationService.markRead(userId, id);
  }
}
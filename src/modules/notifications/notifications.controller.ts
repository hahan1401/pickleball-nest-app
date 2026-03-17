import { Controller, Get, Param, Put, Query } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserEntity } from '../../domain/entities/user.entity';
import { NotificationsService } from './notifications.service';

@Controller('api/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // GET /api/notifications
  @Get()
  findAll(@CurrentUser() user: UserEntity, @Query() query: any) {
    return this.notificationsService.findAll(user.id, query);
  }

  // PUT /api/notifications/:id/read
  @Put(':id/read')
  markRead(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return this.notificationsService.markRead(id, user.id);
  }

  // PUT /api/notifications/read-all
  @Put('read-all')
  markAllRead(@CurrentUser() user: UserEntity) {
    return this.notificationsService.markAllRead(user.id);
  }
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NOTIFICATION_EVENTS, Public } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { NotificationGateway } from './notification.gateway';

@ApiTags('Notification')
@ApiBearerAuth()
@Controller('notification')
export class NotificationController {
  private readonly notificationServiceUrl: string;

  constructor(
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientProxy,
    private readonly notificationGateway: NotificationGateway,
    private readonly configService: ConfigService,
  ) {
    this.notificationServiceUrl = this.configService.get<string>(
      'NOTIFICATION_SERVICE_URL',
      'http://localhost:3003',
    );
  }

  @ApiOperation({ summary: 'Send a push notification (publishes to queue)' })
  @ApiBody({
    schema: {
      properties: {
        userId: { type: 'string' },
        message: { type: 'string' },
        type: { type: 'string', example: 'info' },
      },
    },
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @Post('send-push')
  @Public()
  sendPushNotification(
    @Body() payload: { userId: string; message: string; type?: string },
  ) {
    this.notificationClient.emit(NOTIFICATION_EVENTS.PUSH_NOTIFICATION, payload);
    return { success: true, message: 'Notification queued for delivery' };
  }

  @ApiOperation({
    summary: 'Internal: Send notification directly via WebSocket only',
  })
  @ApiBody({
    schema: {
      properties: {
        userId: { type: 'string' },
        message: { type: 'string' },
        type: { type: 'string', example: 'info' },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('internal/send-direct')
  @Public()
  sendDirectNotification(
    @Body() payload: { userId: string; message: string; type?: string },
  ) {
    const sent = this.notificationGateway.sendToUser(
      payload.userId,
      'notification',
      { message: payload.message, type: payload.type || 'info' },
    );

    return {
      success: true,
      delivered: sent,
      message: sent
        ? 'Notification delivered to connected client(s)'
        : 'User not connected',
    };
  }

  @ApiOperation({ summary: 'Get notification inbox for a user' })
  @Get('inbox/:userId')
  @Public()
  async getInbox(@Param('userId') userId: string) {
    const response = await fetch(
      `${this.notificationServiceUrl}/notifications/inbox/${userId}`,
    );
    return response.json();
  }

  @ApiOperation({ summary: 'Mark a notification as read' })
  @Patch(':id/read/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Public()
  async markRead(@Param('id') id: string, @Param('userId') userId: string) {
    await fetch(
      `${this.notificationServiceUrl}/notifications/${id}/read/${userId}`,
      { method: 'PATCH' },
    );
  }

  @Public()
  @ApiOperation({ summary: 'Test notification to user1 and user2' })
  @ApiBody({
    schema: {
      properties: {
        message: { type: 'string', example: 'Test notification message' },
      },
    },
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @Post('test-users')
  testNotifyUsers(@Body() body: { message: string }) {
    const message = body.message || 'Test notification from API Gateway';
    const users = ['user1', 'user2'];

    users.forEach((userId) => {
      this.notificationClient.emit(NOTIFICATION_EVENTS.PUSH_NOTIFICATION, {
        userId,
        message,
        type: 'test',
      });
    });

    return {
      success: true,
      message: `Notifications queued for ${users.join(', ')}`,
      users,
    };
  }
}
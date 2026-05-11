import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NOTIFICATION_EVENTS, Public } from '@app/common';
import { NotificationGateway } from './notification.gateway';

@ApiTags('Notification')
@ApiBearerAuth()
@Controller('notification')
export class NotificationController {
  constructor(
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientProxy,
    private readonly notificationGateway: NotificationGateway,
  ) {}

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
    // Publish to RabbitMQ - api-notification service will consume and deliver via WebSocket
    this.notificationClient.emit(
      NOTIFICATION_EVENTS.PUSH_NOTIFICATION,
      payload,
    );

    return {
      success: true,
      message: 'Notification queued for delivery',
    };
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
    // Only send via WebSocket - DO NOT publish to RabbitMQ
    // This endpoint is used by api-notification to prevent infinite loops
    const sent = this.notificationGateway.sendToUser(
      payload.userId,
      'notification',
      {
        message: payload.message,
        type: payload.type || 'info',
      },
    );

    return {
      success: true,
      delivered: sent,
      message: sent
        ? 'Notification delivered to connected client(s)'
        : 'User not connected',
    };
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

    // Publish to RabbitMQ - api-notification will deliver to users
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

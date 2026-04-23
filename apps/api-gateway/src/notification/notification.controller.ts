import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NOTIFICATION_EVENTS, Public } from '@app/common';

@ApiTags('Notification')
@ApiBearerAuth()
@Controller('notification')
export class NotificationController {
  constructor(
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Send a push notification' })
  @ApiBody({
    schema: {
      properties: {
        userId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @Post('send-push')
  @Public()
  sendPushNotification(
    @Body() payload: { userId: string; message: string },
  ) {
    // Publish to RabbitMQ - notification microservice will handle delivery
    this.notificationClient.emit(
      NOTIFICATION_EVENTS.PUSH_NOTIFICATION,
      payload,
    );

    return {
      success: true,
      message: 'Notification event published to queue',
    };
  }

  @Public()
  @ApiOperation({ summary: 'Test notification to user1 and user2 via RabbitMQ' })
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
    const message = body.message || 'Test notification from RabbitMQ';
    const users = ['user1', 'user2'];

    // Publish to RabbitMQ - notification microservice will consume and send
    users.forEach((userId) => {
      this.notificationClient.emit(NOTIFICATION_EVENTS.PUSH_NOTIFICATION, {
        userId,
        message,
      });
    });

    return {
      success: true,
      message: `Notifications published to queue for ${users.join(', ')}`,
      users,
    };
  }
}

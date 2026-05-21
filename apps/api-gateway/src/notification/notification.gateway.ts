import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  namespace: /^\/notification\/[\w-]+$/,
  cors: {
    origin: '*',
  },
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);
  private clients: Map<string, Set<Socket>> = new Map();
  private readonly notificationServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.notificationServiceUrl = this.configService.get<string>(
      'NOTIFICATION_SERVICE_URL',
      'http://localhost:3003',
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized in API Gateway');
  }

  async handleConnection(client: Socket) {
    const userId = this.extractUserIdFromNamespace(client.nsp.name);

    if (!userId) {
      this.logger.warn(`Invalid namespace: ${client.nsp.name}`);
      client.disconnect();
      return;
    }

    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set());
    }
    this.clients.get(userId).add(client);

    this.logger.log(
      `Client ${client.id} connected to /notification/${userId}. Total clients for user: ${this.clients.get(userId).size}`,
    );

    client.emit('connected', {
      message: `Connected to notification channel for user ${userId}`,
      timestamp: new Date().toISOString(),
    });

    await this.flushPendingNotifications(userId, client);
  }

  handleDisconnect(client: Socket) {
    const userId = this.extractUserIdFromNamespace(client.nsp.name);

    if (userId && this.clients.has(userId)) {
      this.clients.get(userId).delete(client);

      if (this.clients.get(userId).size === 0) {
        this.clients.delete(userId);
      }

      this.logger.log(
        `Client ${client.id} disconnected from /notification/${userId}`,
      );
    }
  }

  sendToUser(userId: string, event: string, data: any) {
    const userClients = this.clients.get(userId);

    if (!userClients || userClients.size === 0) {
      this.logger.warn(`No connected clients for user ${userId}`);
      return false;
    }

    userClients.forEach((client) => {
      client.emit(event, {
        ...data,
        timestamp: new Date().toISOString(),
      });
    });

    this.logger.log(
      `Sent "${event}" event to ${userClients.size} client(s) for user ${userId}`,
    );
    return true;
  }

  broadcast(event: string, data: any) {
    this.server.emit(event, {
      ...data,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Broadcasted "${event}" event to all connected clients`);
  }

  getClientCount(userId: string): number {
    return this.clients.get(userId)?.size || 0;
  }

  getConnectedUserIds(): string[] {
    return Array.from(this.clients.keys());
  }

  private async flushPendingNotifications(
    userId: string,
    client: Socket,
  ): Promise<void> {
    try {
      const response = await fetch(
        `${this.notificationServiceUrl}/notifications/pending/${userId}`,
      );

      if (!response.ok) return;

      const pending: Array<{
        id: string;
        message: string;
        type: string;
        createdAt: string;
      }> = await response.json();

      if (pending.length === 0) return;

      pending.forEach((n) => {
        client.emit('notification', {
          id: n.id,
          message: n.message,
          type: n.type,
          timestamp: n.createdAt,
        });
      });

      this.logger.log(
        `Flushed ${pending.length} pending notification(s) to user ${userId} on connect`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to fetch pending notifications for user ${userId}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  private extractUserIdFromNamespace(namespace: string): string | null {
    const match = namespace.match(/^\/notification\/([\w-]+)$/);
    return match ? match[1] : null;
  }
}
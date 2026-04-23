import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

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

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
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

  /**
   * Send notification to a specific user
   */
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

  /**
   * Broadcast to all connected users
   */
  broadcast(event: string, data: any) {
    this.server.emit(event, {
      ...data,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Broadcast "${event}" event to all clients`);
  }

  /**
   * Get number of connected clients for a user
   */
  getConnectedClientCount(userId: string): number {
    return this.clients.get(userId)?.size || 0;
  }

  /**
   * Get all connected user IDs
   */
  getConnectedUsers(): string[] {
    return Array.from(this.clients.keys());
  }

  /**
   * Extract user ID from namespace like /notification/123
   */
  private extractUserIdFromNamespace(namespace: string): string | null {
    const match = namespace.match(/^\/notification\/([\w-]+)$/);
    return match ? match[1] : null;
  }
}

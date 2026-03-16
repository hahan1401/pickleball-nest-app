import { Injectable } from '@nestjs/common';

// Phase 2 — Real-time chat (direct + group)
@Injectable()
export class ChatService {
  async getUserChats(userId: string) {
    // TODO: return rooms sorted by latest message, unread count
    return [];
  }

  async createRoom(userId: string, dto: any) {
    // TODO: create direct or group chat room
    return {};
  }

  async getMessages(roomId: string, userId: string) {
    // TODO: paginated messages, cursor-based
    // TODO: mark messages as read
    return [];
  }

  async sendMessage(roomId: string, senderId: string, dto: any) {
    // TODO: save message + emit via ChatGateway (Socket.io)
    // Offline queue for messages sent while disconnected
    return {};
  }
}

import { Injectable } from '@nestjs/common';

// Phase 2 — Community games (casual play)
@Injectable()
export class CommunityService {
  async getLobby(query: any) {
    // TODO: filter by date, location radius, skill level, available spots
    // Default sort: nearest location
    return [];
  }

  async createGame(creatorId: string, dto: any) {
    // TODO: create game + auto-create group chat room
    return {};
  }

  async findGame(id: string) {
    // TODO: return game details with participant list
    return {};
  }

  async updateGame(id: string, creatorId: string, dto: any) {
    // TODO: update + notify participants of significant changes
    return {};
  }

  async deleteGame(id: string, creatorId: string) {
    // TODO: soft delete + notify participants
    return { message: 'Game deleted' };
  }

  async invitePlayer(gameId: string, creatorId: string, targetUserId: string) {
    // TODO: suggest players by proximity + skill level
    return {};
  }

  async joinGame(gameId: string, userId: string) {
    // TODO: use DB transaction to prevent race condition
    // Waitlist if full
    return {};
  }

  async leaveGame(gameId: string, userId: string) {
    // TODO: promote waitlist user when spot opens
    return { message: 'Left game' };
  }
}

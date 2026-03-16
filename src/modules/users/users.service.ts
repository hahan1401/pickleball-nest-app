import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async updateProfile(userId: string, dto: Partial<User>) {
    await this.usersRepository.update(userId, dto);
    return this.usersRepository.findOne({ where: { id: userId } });
  }

  async getUserTournaments(userId: string) {
    // TODO: implement with pagination
    return [];
  }

  async getFollowing(userId: string) {
    // TODO: implement follows
    return [];
  }

  async getFollowers(userId: string) {
    // TODO: implement follows
    return [];
  }

  async getPublicProfile(userId: string) {
    return this.usersRepository.findOne({ where: { id: userId } });
  }
}

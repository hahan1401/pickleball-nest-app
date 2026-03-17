import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async getProfile(userId: string): Promise<UserResponseDto | null> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    return user ? UserResponseDto.fromEntity(user) : null;
  }

  async updateProfile(userId: string, dto: Partial<UserEntity>) {
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

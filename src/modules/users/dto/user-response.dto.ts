import { UserEntity } from '../../../domain/entities/user.entity';

export class UserResponseDto {
  id: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
  bio: string | null;
  skillLevel: number;
  dominantHand: string | null;
  paddleType: string | null;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(user: UserEntity): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.name = user.name;
    dto.email = user.email ?? null;
    dto.avatarUrl = user.avatarUrl ?? null;
    dto.bio = user.bio ?? null;
    dto.skillLevel = user.skillLevel;
    dto.dominantHand = user.dominantHand ?? null;
    dto.paddleType = user.paddleType ?? null;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    return dto;
  }
}

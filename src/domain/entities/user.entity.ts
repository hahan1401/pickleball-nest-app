import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Tournament } from './tournament.entity';
import { Participant } from './participant.entity';
import { Notification } from './notification.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'facebook_user_id', unique: true, nullable: true })
  facebookUserId: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ name: 'password_hash', nullable: true })
  passwordHash: string;

  @Column()
  name: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({
    name: 'skill_level',
    type: 'decimal',
    precision: 2,
    scale: 1,
    default: 3.0,
  })
  skillLevel: number;

  @Column({ name: 'dominant_hand', nullable: true })
  dominantHand: string; // 'left' | 'right'

  @Column({ name: 'paddle_type', nullable: true })
  paddleType: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Tournament, (tournament) => tournament.creator)
  tournaments: Tournament[];

  @OneToMany(() => Participant, (participant) => participant.user)
  participations: Participant[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}

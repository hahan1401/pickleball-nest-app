import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
  type: string; // 'tournament_invite' | 'request_approved' | 'match_result' | ...

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  body: string;

  // { tournamentId: '...', matchId: '...' }
  @Column({ type: 'json', nullable: true })
  data: Record<string, any>;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

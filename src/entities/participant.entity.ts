import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Tournament } from './tournament.entity';

export enum ParticipantStatus {
  CONFIRMED = 'confirmed',
  INVITED_PENDING = 'invited_pending',
  REQUEST_PENDING = 'request_pending',
  REJECTED = 'rejected',
}

@Entity('participants')
@Unique(['tournamentId', 'userId'])
export class Participant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tournament_id' })
  tournamentId: string;

  @ManyToOne(() => Tournament, (tournament) => tournament.participants)
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.participations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: ParticipantStatus })
  status: ParticipantStatus;

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: Date;
}

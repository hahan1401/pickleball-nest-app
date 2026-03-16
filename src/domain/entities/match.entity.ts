import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tournament } from './tournament.entity';
import { TournamentGroup } from './tournament-group.entity';
import { MatchStatus } from '../enums/match-status.enum';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tournament_id' })
  tournamentId: string;

  @ManyToOne(() => Tournament, (tournament) => tournament.matches)
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament;

  @Column({ name: 'group_id' })
  groupId: string;

  @ManyToOne(() => TournamentGroup, (group) => group.matches)
  @JoinColumn({ name: 'group_id' })
  group: TournamentGroup;

  @Column()
  round: number; // 1, 2, 3

  @Column({ name: 'match_order' })
  matchOrder: number; // 1, 2 (trong mỗi vòng)

  // UUID của user_id (singles) hoặc team_id (doubles)
  @Column({ name: 'player1_id', type: 'uuid' })
  player1Id: string;

  @Column({ name: 'player2_id', type: 'uuid' })
  player2Id: string;

  // Ví dụ: [11, 9, 11]
  @Column({ name: 'player1_scores', type: 'json', nullable: true })
  player1Scores: number[];

  @Column({ name: 'player2_scores', type: 'json', nullable: true })
  player2Scores: number[];

  // UUID của user_id hoặc team_id thắng
  @Column({ name: 'winner_id', type: 'uuid', nullable: true })
  winnerId: string;

  @Column({ type: 'enum', enum: MatchStatus, default: MatchStatus.SCHEDULED })
  status: MatchStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

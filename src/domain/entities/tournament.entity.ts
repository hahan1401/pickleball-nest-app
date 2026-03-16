import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Participant } from './participant.entity';
import { Team } from './team.entity';
import { TournamentGroup } from './tournament-group.entity';
import { Match } from './match.entity';
import { TournamentType } from '../enums/tournament-type.enum';
import { ScoringFormat } from '../enums/scoring-format.enum';
import { TournamentStatus } from '../enums/tournament-status.enum';

@Entity('tournaments')
export class Tournament {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'creator_id' })
  creatorId: string;

  @ManyToOne(() => User, (user) => user.tournaments)
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: TournamentType })
  type: TournamentType;

  @Column({ name: 'num_groups' })
  numGroups: number;

  @Column({
    name: 'scoring_format',
    type: 'enum',
    enum: ScoringFormat,
    default: ScoringFormat.BEST_OF_3,
  })
  scoringFormat: ScoringFormat;

  @Column({ type: 'enum', enum: TournamentStatus, default: TournamentStatus.DRAFT })
  status: TournamentStatus;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ nullable: true })
  location: string;

  @Column({ name: 'banner_url', nullable: true })
  bannerUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Participant, (participant) => participant.tournament)
  participants: Participant[];

  @OneToMany(() => Team, (team) => team.tournament)
  teams: Team[];

  @OneToMany(() => TournamentGroup, (group) => group.tournament)
  groups: TournamentGroup[];

  @OneToMany(() => Match, (match) => match.tournament)
  matches: Match[];
}

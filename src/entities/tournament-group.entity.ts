import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Tournament } from './tournament.entity';
import { GroupMember } from './group-member.entity';
import { Match } from './match.entity';

@Entity('tournament_groups')
export class TournamentGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tournament_id' })
  tournamentId: string;

  @ManyToOne(() => Tournament, (tournament) => tournament.groups)
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament;

  @Column()
  name: string;

  @Column({ name: 'order' })
  order: number;

  @OneToMany(() => GroupMember, (member) => member.group)
  members: GroupMember[];

  @OneToMany(() => Match, (match) => match.group)
  matches: Match[];
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Tournament } from './tournament.entity';
import { UserEntity } from './user.entity';
import { GroupMember } from './group-member.entity';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tournament_id' })
  tournamentId: string;

  @ManyToOne(() => Tournament, (tournament) => tournament.teams)
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament;

  @Column({ nullable: true })
  name: string;

  @Column({ name: 'player1_id' })
  player1Id: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'player1_id' })
  player1: UserEntity;

  @Column({ name: 'player2_id' })
  player2Id: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'player2_id' })
  player2: UserEntity;

  @OneToMany(() => GroupMember, (member) => member.team)
  groupMembers: GroupMember[];
}

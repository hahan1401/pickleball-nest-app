import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TournamentGroup } from './tournament-group.entity';
import { UserEntity } from './user.entity';
import { Team } from './team.entity';

@Entity('group_members')
export class GroupMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'group_id' })
  groupId: string;

  @ManyToOne(() => TournamentGroup, (group) => group.members)
  @JoinColumn({ name: 'group_id' })
  group: TournamentGroup;

  // NULL nếu doubles
  @Column({ name: 'player_id', nullable: true })
  playerId: string;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'player_id' })
  player: UserEntity;

  // NULL nếu singles
  @Column({ name: 'team_id', nullable: true })
  teamId: string;

  @ManyToOne(() => Team, (team) => team.groupMembers, { nullable: true })
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @Column({ name: 'seed_order', nullable: true })
  seedOrder: number;
}

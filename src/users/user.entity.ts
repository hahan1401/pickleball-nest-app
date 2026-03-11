import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // @OneToMany(() => Tournament, (tournament) => tournament.creator)
  // tournaments: Tournament[];

  // @OneToMany(() => Participant, (participant) => participant.user)
  // participations: Participant[];

  // @OneToMany(() => Notification, (notification) => notification.user)
  // notifications: Notification[];
}

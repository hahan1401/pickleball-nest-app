import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from '../../domain/entities/tournament.entity';
import { Participant } from '../../domain/entities/participant.entity';
import { Team } from '../../domain/entities/team.entity';
import { TournamentGroup } from '../../domain/entities/tournament-group.entity';
import { GroupMember } from '../../domain/entities/group-member.entity';
import { TournamentStatus } from '../../domain/enums/tournament-status.enum';
import { ParticipantStatus } from '../../domain/enums/participant-status.enum';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentsRepo: Repository<Tournament>,
    @InjectRepository(Participant)
    private readonly participantsRepo: Repository<Participant>,
    @InjectRepository(Team)
    private readonly teamsRepo: Repository<Team>,
    @InjectRepository(TournamentGroup)
    private readonly groupsRepo: Repository<TournamentGroup>,
    @InjectRepository(GroupMember)
    private readonly groupMembersRepo: Repository<GroupMember>,
  ) {}

  async findAll(query: any) {
    // TODO: filter by status, type, search, pagination
    return this.tournamentsRepo.find({ order: { createdAt: 'DESC' } });
  }

  async create(creatorId: string, dto: CreateTournamentDto) {
    const tournament = this.tournamentsRepo.create({ ...dto, creatorId });
    return this.tournamentsRepo.save(tournament);
  }

  async findOne(id: string) {
    const tournament = await this.tournamentsRepo.findOne({
      where: { id },
      relations: ['creator', 'participants', 'groups'],
    });
    if (!tournament) throw new NotFoundException('Tournament not found');
    return tournament;
  }

  async update(id: string, userId: string, dto: UpdateTournamentDto) {
    const tournament = await this.findOne(id);
    if (tournament.creatorId !== userId) throw new ForbiddenException();
    await this.tournamentsRepo.update(id, dto);
    return this.findOne(id);
  }

  async cancel(id: string, userId: string) {
    const tournament = await this.findOne(id);
    if (tournament.creatorId !== userId) throw new ForbiddenException();
    await this.tournamentsRepo.update(id, { status: TournamentStatus.CANCELLED });
    return { message: 'Tournament cancelled' };
  }

  async updateStatus(id: string, userId: string, status: string) {
    const tournament = await this.findOne(id);
    if (tournament.creatorId !== userId) throw new ForbiddenException();
    // TODO: validate state machine transitions
    await this.tournamentsRepo.update(id, { status: status as TournamentStatus });
    return this.findOne(id);
  }

  async invitePlayer(tournamentId: string, creatorId: string, targetUserId: string) {
    const tournament = await this.findOne(tournamentId);
    if (tournament.creatorId !== creatorId) throw new ForbiddenException();
    // TODO: check capacity, send notification
    const participant = this.participantsRepo.create({
      tournamentId,
      userId: targetUserId,
      status: ParticipantStatus.INVITED_PENDING,
    });
    return this.participantsRepo.save(participant);
  }

  async requestJoin(tournamentId: string, userId: string) {
    // TODO: check tournament status is OPEN, check capacity
    const participant = this.participantsRepo.create({
      tournamentId,
      userId,
      status: ParticipantStatus.REQUEST_PENDING,
    });
    return this.participantsRepo.save(participant);
  }

  async handleRequest(tournamentId: string, requestId: string, creatorId: string, action: 'accept' | 'reject') {
    const tournament = await this.findOne(tournamentId);
    if (tournament.creatorId !== creatorId) throw new ForbiddenException();
    const status = action === 'accept' ? ParticipantStatus.CONFIRMED : ParticipantStatus.REJECTED;
    await this.participantsRepo.update(requestId, { status });
    return { message: `Request ${action}ed` };
  }

  async getParticipants(tournamentId: string) {
    return this.participantsRepo.find({
      where: { tournamentId },
      relations: ['user'],
    });
  }

  async removeParticipant(tournamentId: string, userId: string, requesterId: string) {
    // TODO: check permissions (creator or self), check tournament state
    await this.participantsRepo.delete({ tournamentId, userId });
    return { message: 'Participant removed' };
  }

  async createTeams(tournamentId: string, creatorId: string, teams: any[]) {
    // TODO: implement doubles team pairing
    return [];
  }

  async randomTeams(tournamentId: string, creatorId: string) {
    // TODO: Fisher-Yates shuffle participants into pairs
    return [];
  }

  async createGroups(tournamentId: string, creatorId: string, groups: any[]) {
    // TODO: create groups + generate Round Robin schedule
    return [];
  }

  async randomGroups(tournamentId: string, creatorId: string) {
    // TODO: random grouping with preview (don't save until confirmed)
    return [];
  }

  async getDraw(tournamentId: string) {
    // TODO: return bracket/draw data for visualization
    return {};
  }
}

import { TournamentType } from '../../../domain/enums/tournament-type.enum';
import { ScoringFormat } from '../../../domain/enums/scoring-format.enum';

export class CreateTournamentDto {
  name: string;
  description?: string;
  type: TournamentType;
  numGroups: number;
  scoringFormat?: ScoringFormat;
  date?: Date;
  location?: string;
  bannerUrl?: string;
}

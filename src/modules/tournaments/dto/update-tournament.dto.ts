import { ScoringFormat } from '../../../domain/enums/scoring-format.enum';

export class UpdateTournamentDto {
  name?: string;
  description?: string;
  scoringFormat?: ScoringFormat;
  date?: Date;
  location?: string;
  bannerUrl?: string;
}

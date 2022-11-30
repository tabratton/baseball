import type { MLBBoxScore } from 'baseball/interfaces/MLBAPI/MLBBoxScore';
import type { MLBLineScore } from 'baseball/interfaces/MLBAPI/MLBLineScore';
import type { MLBScheduleEntry } from 'baseball/interfaces/MLBAPI/MLBScheduleEntry';

export interface MappedGame {
  lineScore?: MLBLineScore;
  boxScore?: MLBBoxScore;
  schedule: MLBScheduleEntry;
  gamePk: string;
  gameTime: Date;
  inProgress: boolean;
  home: Team;
  away: Team;
  gameDate: string;
}

interface Team {
  short?: string;
  name?: string;
  bgClass?: string;
  textClass?: string;
}

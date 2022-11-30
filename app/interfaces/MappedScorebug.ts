import { MLBBoxScorePlayer } from 'baseball/interfaces/MLBAPI/MLBBoxScore';

export interface MappedScorebug {
  gamePk: string;
  isTop: boolean;
  inProgress: boolean;
  isPregame: boolean;
  gameTime: Date;
  gameDate: string;
  home: Team;
  away: Team;
  inning: number;
  displaySide: boolean;
  batterCount?: string;
  outs: boolean[];
  runners: { num: number; runner: boolean }[];
  statusCode: string;
}

interface Team {
  team?: string;
  bgClass?: string;
  textClass?: string;
  score: number;
  currentPlayer?: MLBBoxScorePlayer;
  order?: string;
}

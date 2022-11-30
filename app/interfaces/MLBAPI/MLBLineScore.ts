import { MLBPlayer } from 'baseball/interfaces/MLBAPI/MLBPlayer';

export interface MLBLineScore {
  balls: number;
  strikes: number;
  currentInning: number;
  currentInningOrdinal: string;
  defense: {
    battingOrder: number;
    batter: MLBPlayer;
    catcher: MLBPlayer;
    center: MLBPlayer;
    first: MLBPlayer;
    inHole: MLBPlayer;
    left: MLBPlayer;
    onDeck: MLBPlayer;
    pitcher: MLBPlayer;
    right: MLBPlayer;
    second: MLBPlayer;
    shortstop: MLBPlayer;
    team: MLBLineScoreTeam;
    third: MLBPlayer;
  };
  inningHalf: string;
  inningState: string;
  innings: MLBLineScoreInning[];
  isTopInning: boolean;
  offense: {
    battingOrder: number;
    batter: MLBPlayer;
    inHole: MLBPlayer;
    onDeck: MLBPlayer;
    pitcher: MLBPlayer;
    team: MLBLineScoreTeam;
    first: boolean;
    second: boolean;
    third: boolean;
  };
  outs: number;
  scheduledInnings: number;
  teams: {
    away: MLBLineScoreTeamStatus;
    home: MLBLineScoreTeamStatus;
  };
}

interface MLBLineScoreInning {
  away: MLBLineScoreTeamStatus;
  home: MLBLineScoreTeamStatus;
  num: number;
  ordinalNum: string;
}

interface MLBLineScoreTeamStatus {
  errors: number;
  hits: number;
  leftOnBase: number;
  runs: number;
}

interface MLBLineScoreTeam {
  id: number;
  link: string;
  name: string;
}

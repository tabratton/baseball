export interface MLBScheduleResponse {
  copyright: string;
  dates: MLBScheduleDate[];
  totalEvents: number;
  totalGames: number;
  totalGamesInProgress: number;
  totalItems: number;
}

export interface MLBScheduleDate {
  date: string;
  events: object[];
  games: MLBScheduleEntry[];
  totalEvents: number;
  totalGames: number;
  totalGamesInProgress: number;
  totalItems: number;
}

export interface MLBScheduleEntry {
  calendarEventID: string;
  content: {
    link: string;
  };
  dayNight: string;
  doubleHeader: string;
  gameDate: string;
  gameNumber: number;
  gamePk: number;
  gameType: string;
  gamedayType: string;
  gamesInSeries: number;
  ifNecessary: string;
  ifNecessaryDescription: string;
  inningBreakLength: number;
  isTie: false;
  link: string;
  officialDate: string;
  publicFacing: boolean;
  recordSource: string;
  reverseHomeAwayStatus: number;
  scheduledInnings: number;
  season: string;
  seasonDisplay: string;
  seriesDescription: string;
  seriesGameNumber: number;
  status: {
    abstractGameCode: string;
    abstractGameState: string;
    codedGameState: string;
    detailedState: string;
    startTimeTBD: boolean;
    statusCode: string;
  };
  teams: {
    home: MLBScheduleTeam;
    away: MLBScheduleTeam;
  };
  venue: {
    id: number;
    link: string;
    name: string;
  };
}

interface MLBScheduleTeam {
  isWinner: boolean;
  leagueRecord: {
    losses: number;
    pct: string;
    wins: number;
  };
  score: number;
  seriesNumber: number;
  splitSquad: boolean;
  team: {
    id: number;
    link: string;
    name: string;
  };
}

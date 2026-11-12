/**
 * Types describing the subset of the MLB Stats API (https://statsapi.mlb.com)
 * responses this app consumes. They are intentionally partial: only fields the
 * app reads are listed.
 */

export interface IdName {
  id: number;
  name: string;
}

export interface PersonRef {
  id: number;
  fullName: string;
  firstName?: string;
  lastName?: string;
}

export interface WinLossRecord {
  wins: number;
  losses: number;
  pct?: string;
}

// ---------------------------------------------------------------------------
// Live game feed: /v1.1/game/:gamePk/feed/live
// ---------------------------------------------------------------------------

export interface GameDataTeam {
  id: number;
  name: string;
  franchiseName: string;
  clubName: string;
  record: WinLossRecord;
}

export interface InningHalf {
  runs?: number;
  hits?: number;
  errors?: number;
}

export interface LineScoreInning {
  num: number;
  home: InningHalf;
  away: InningHalf;
}

export interface LineScore {
  innings: LineScoreInning[];
  scheduledInnings: number;
  currentInning?: number;
  isTopInning?: boolean;
  outs?: number;
  balls?: number;
  strikes?: number;
  offense: {
    batter?: PersonRef;
    first?: PersonRef;
    second?: PersonRef;
    third?: PersonRef;
  };
  defense: {
    pitcher?: PersonRef;
  };
}

export interface BattingStats {
  hits: number;
  doubles: number;
  triples: number;
  homeRuns: number;
  atBats: number;
  runs: number;
  baseOnBalls: number;
  rbi: number;
  hitByPitch: number;
  plateAppearances?: number;
}

export interface PitchingStats {
  /** Formatted like "6.1" (6⅓ innings). */
  inningsPitched: string;
  hits: number;
  earnedRuns: number;
  strikeOuts: number;
  baseOnBalls: number;
  balls: number;
  strikes: number;
  pitchesThrown: number;
}

export interface BoxScorePlayer {
  person: PersonRef;
  jerseyNumber: string;
  battingOrder?: string;
  position: { abbreviation: string };
  stats: {
    batting: BattingStats;
    pitching: PitchingStats;
  };
}

export interface BoxScoreTeam {
  batters: number[];
  pitchers: number[];
  players: Record<string, BoxScorePlayer>;
}

export interface GameFeed {
  gamePk: number;
  metaData: { wait?: number };
  gameData: {
    datetime: { dateTime: string };
    status: { abstractGameCode: string };
    gameInfo: { gameDurationMinutes: number; firstPitch: string };
    teams: { home: GameDataTeam; away: GameDataTeam };
  };
  liveData: {
    linescore: LineScore;
    boxscore: { teams: { home: BoxScoreTeam; away: BoxScoreTeam } };
    decisions?: {
      winner?: PersonRef;
      loser?: PersonRef;
      save?: PersonRef;
    };
  };
}

// ---------------------------------------------------------------------------
// Schedule: /v1/schedule
// ---------------------------------------------------------------------------

export interface ScheduleGameTeam {
  team: IdName;
  isWinner?: boolean;
  score?: number;
  leagueRecord: WinLossRecord;
}

export interface ScheduleGame {
  gamePk: number;
  officialDate: string;
  status: { codedGameState: string };
  teams: { home: ScheduleGameTeam; away: ScheduleGameTeam };
}

export interface ScheduleResponse {
  dates: { games: ScheduleGame[] }[];
}

// ---------------------------------------------------------------------------
// Standings: /v1/standings
// ---------------------------------------------------------------------------

export interface Division {
  id: number;
  name: string;
  nameShort: string;
  link: string;
}

export interface TeamRecordData {
  team: IdName & { division: Division };
  divisionRank: string;
  leagueRecord: WinLossRecord;
  gamesBack: string;
  wildCardGamesBack: string;
  runsScored: number;
  runsAllowed: number;
  runDifferential: number;
}

export interface StandingsResponse {
  records: {
    division: { id: number };
    teamRecords?: TeamRecordData[];
  }[];
}

// ---------------------------------------------------------------------------
// Seasons: /v1/seasons/:year
// ---------------------------------------------------------------------------

export interface SeasonData {
  regularSeasonStartDate: string;
  regularSeasonEndDate: string;
  postSeasonStartDate: string;
  postSeasonEndDate: string;
}

export interface SeasonsResponse {
  seasons: SeasonData[];
}

// ---------------------------------------------------------------------------
// People: /v1/people/:id
// ---------------------------------------------------------------------------

export interface StatSplit {
  season: string;
  stat: Record<string, string | number | undefined>;
  team?: IdName;
  position?: { code: string; abbreviation: string };
}

export interface StatGroup {
  type: { displayName: string };
  group: { displayName: string };
  splits: StatSplit[];
}

export interface PersonData {
  id: number;
  primaryNumber: string;
  useName: string;
  useLastName: string;
  nickName?: string;
  batSide: { description: string };
  pitchHand: { description: string };
  height: string;
  weight: number;
  currentAge: number;
  birthDate: string;
  birthCity: string;
  birthCountry: string;
  mlbDebutDate: string;
  stats: StatGroup[];
}

export interface PeopleResponse {
  people: PersonData[];
}

// ---------------------------------------------------------------------------
// League leaders: /v1/stats/leaders
// ---------------------------------------------------------------------------

export interface Leader {
  rank: number;
  value: string;
  person: PersonRef;
}

export interface LeagueLeadersResponse {
  leagueLeaders: { leaders?: Leader[] }[];
}

// ---------------------------------------------------------------------------
// Postseason: /v1/schedule/postseason/series
// ---------------------------------------------------------------------------

export interface PostSeasonGameTeam {
  team: IdName;
  leagueRecord: WinLossRecord;
}

export interface PostSeasonGame {
  gamePk: number;
  officialDate: string;
  teams: { home: PostSeasonGameTeam; away: PostSeasonGameTeam };
  seriesStatus: { abbreviation: string };
}

export interface PostSeasonSeriesData {
  series: { id: string };
  games: PostSeasonGame[];
}

export interface PostSeasonResponse {
  series: PostSeasonSeriesData[];
}

/** Summary of a postseason series, as derived by the mlb-api service. */
export interface SeriesSummary {
  team1: { id: number; name: string; wins: number };
  team2: { id: number; name: string; wins: number };
  seriesId: string;
  seriesType: string;
}

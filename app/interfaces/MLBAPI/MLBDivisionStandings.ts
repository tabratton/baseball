export interface MLBStandingsResponse {
  copyright: string;
  records: MLBDivisionStandings[];
}

export interface MLBDivisionStandings {
  division: { id: number; link: string };
  lastUpdated: string;
  league: { id: number; link: string };
  sport: { id: number; link: string };
  standingsType: string;
  teamRecords: MLBTeamRecord[];
}

export interface MLBTeamRecord {
  clinched: boolean;
  conferenceGamesBack: string;
  divisionChamp: boolean;
  divisionGamesBack: string;
  divisionLeader: true;
  divisionRank: string;
  eliminationNumber: string;
  gamesBack: string;
  gamesPlayer: number;
  hasWildcard: true;
  lastUpdated: string;
  leagueGamesBack: string;
  leagueRank: string;
  leagueRecord: { losses: number; pct: string; ties: number; wins: number };
  losses: number;
  magicNumber: string;
  records: {
    divisionRecords: MLBTeamSimpleRecord[];
    expectedRecords: MLBTeamSimpleRecord[];
    leagueRecords: MLBTeamSimpleRecord[];
    overallRecords: MLBTeamSimpleRecord[];
    splitRecords: MLBTeamSimpleRecord[];
  };
  runDifferential: number;
  runsAllowed: number;
  runsScored: number;
  season: string;
  sportGamesBack: string;
  sportRank: string;
  springLeagueGamesBack: string;
  streak: {
    streakCode: string;
    streakNumber: number;
    streakType: 'wins' | 'losses';
  };
  team: MLBTeam;
  wildCardEliminationNumber: string;
  wildCardGamesBack: string;
  winningPercentage: string;
  wins: number;
}

export interface MLBTeamSimpleRecord {
  division: { id: number; name: string; link: string };
  losses: number;
  pct: string;
  wins: number;
  type?: string;
}

export interface MLBTeam {
  abbreviation: string;
  active: boolean;
  allStarStatus: string;
  clubName: string;
  division: MLBTeamDivision;
  fileCode: string;
  firstYearOfPlay: string;
  franchiseName: string;
  id: number;
  league: { id: number; name: string; link: string };
  link: string;
  locationName: string;
  name: string;
  season: number;
  shortName: string;
  sport: { id: number; link: string; name: string };
  springLeague: {
    abbreviation: string;
    id: number;
    name: string;
    link: string;
  };
  springVenue: { id: number; link: string };
  teamCode: string;
  teamName: string;
  venue: { id: number; name: string; link: string };
}

export interface MLBTeamDivision {
  abbreviation: string;
  active: boolean;
  hasWildCard: boolean;
  id: number;
  league: { id: number; link: string };
  link: string;
  name: string;
  nameShort: string;
  numPlayoffTeams: number;
  season: string;
  sortOrder: number;
  sport: { id: number; link: string };
}

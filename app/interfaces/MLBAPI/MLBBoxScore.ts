export interface MLBBoxScore {
  info: Info[];
  officials: Official[];
  pitchingNotes: string[];
  teams: {
    away: MLBBoxScoreTeam;
    home: MLBBoxScoreTeam;
  };
}

interface Info {
  label: string;
  value: string;
}

interface Official {
  official: {
    fullName: string;
    id: number;
    link: string;
  };
  officialType: string;
}

export interface MLBBoxScoreTeam {
  batters: number[];
  battingOrder: number[];
  bench: number[];
  bullpen: number[];
  info: TeamInfo[];
  notes: string[];
  pitchers: number[];
  players: MLBBoxScorePlayerDict;
  team: {
    abbreviation: string;
    active: boolean;
    allStarStatus: string;
    clubName: string;
    division: {
      id: number;
      name: string;
      link: string;
    };
    fileCode: string;
    firstYearOfPlay: string;
    franchiseName: string;
    id: number;
    league: {
      id: number;
      name: string;
      link: string;
    };
    link: string;
    locationName: string;
    name: string;
    record: {
      conferenceGamesBack: string;
      divisionGamesBack: string;
      divisionLeader: boolean;
      gamesPlayed: number;
      leagueGamesBack: string;
      leagueRecord: {
        losses: number;
        pct: string;
        ties: number;
        wins: number;
      };
      losses: number;
      records: object;
      sportGamesBack: string;
      springLeagueGamesBack: string;
      wildCardGamesBack: string;
      winningPercentage: string;
      wins: number;
    };
    season: number;
    shortName: string;
    sport: {
      id: number;
      link: string;
      name: string;
    };
    springLeague: {
      abbreviation: string;
      id: number;
      link: string;
      name: string;
    };
    springVenue: {
      id: number;
      link: string;
    };
    teamCode: string;
    teamName: string;
    venue: {
      id: number;
      link: string;
      name: string;
    };
  };
  teamStats: {
    pitching: Pitching;
    batting: Batting;
    fielding: Fielding;
  };
}

interface TeamInfo {
  title: string;
  fieldList: Info[];
}

export interface MLBBoxScorePlayerDict {
  [key: string]: MLBBoxScorePlayer;
}

export interface MLBBoxScorePlayer {
  allPositions: Position[];
  battingOrder?: string;
  gameStatus: {
    isCurrentBatter: boolean;
    isCurrentPitcher: boolean;
    isOnBench: boolean;
    isSubstitute: boolean;
  };
  jerseyNumber: string;
  parentTeamId: number;
  person: {
    id: number;
    fullName: string;
    link: string;
  };
  position: Position;
  seasonStats: {
    batting: Batting;
    fielding: Fielding;
    pitching: Pitching;
  };
  stats: {
    batting: Batting;
    fielding: Fielding;
    pitching: Pitching;
  };
  status: {
    code: string;
    description: string;
  };
}

interface Position {
  abbreviation: string;
  code: string;
  name: string;
  type: string;
}

interface Batting {
  atBats: number;
  atBatsPerHomeRun: string;
  avg: string;
  babip: string;
  baseOnBalls: number;
  catchersInterference: number;
  caughtStealing: number;
  doubles: number;
  flyOuts: number;
  gamesPlayed: number;
  groundIntoDoublePlay: number;
  groundIntoTriplePlay: number;
  groundOuts: number;
  hitByPitch: number;
  hits: number;
  homeRuns: number;
  intentionalWalks: number;
  leftOnBase: number;
  obp: string;
  ops: string;
  pickoffs: number;
  plateAppearances: number;
  rbi: number;
  runs: number;
  sacBunts: number;
  sacFlies: number;
  slg: string;
  stolenBasePercentage: string;
  stolenBases: number;
  strikeOuts: number;
  totalBases: number;
  triples: number;
}

interface Fielding {
  assists: number;
  caughtStealing: number;
  chances: number;
  errors: number;
  fielding: string;
  gamesStarted: number;
  passedBall: number;
  pickoffs: number;
  putOuts: number;
  stolenBasePercentage: string;
  stolenBases: number;
}

interface Pitching {
  airOuts: number;
  atBats: number;
  balks: number;
  balls: number;
  baseOnBalls: number;
  battersFaced: number;
  blownSaves: number;
  catchersInterference: number;
  caughtStealing: number;
  completeGames: number;
  doubles: number;
  earnedRuns: number;
  era: string;
  gamesFinished: number;
  gamesPitched: number;
  gamesPlayed: number;
  gamesStarted: number;
  groundOuts: number;
  groundOutsToAirouts: string;
  hitBatsmen: number;
  hitByPitch: number;
  hits: number;
  hitsPer9Inn: string;
  holds: number;
  homeRuns: number;
  homeRunsPer9: string;
  inheritedRunners: number;
  inheritedRunnersScored: number;
  inningsPitched: string;
  intentionalWalks: number;
  losses: number;
  numberOfPitched: number;
  obp: string;
  outs: number;
  pickoffs: number;
  pitchesPerInning: string;
  pitchesThrown: number;
  rbi: number;
  runs: number;
  runsScoredPer9: string;
  sacBunts: number;
  sacFlies: number;
  saveOpportunities: number;
  saves: number;
  shutouts: number;
  stolenBasePercentage: string;
  stolenBases: number;
  strikeOuts: number;
  strikePercentage: string;
  strikoutWalkRatio: string;
  strikeoutsPer9Inn: string;
  strikes: number;
  triples: number;
  walksPer9Inn: string;
  whip: string;
  wildPitches: number;
  winPercentage: string;
  wins: number;
}

import type { MLBBoxScoreTeam } from './MLBBoxScore';
import type {
  MLBDefense,
  MLBLineScoreInning,
  MLBLineScoreTeamStatus,
  MLBOffense,
} from './MLBLineScore';
import type { MLBBoxScorePlayerDict } from './MLBBoxScore';

export interface MLBGameFeed {
  copyright: string;
  gameData: {
    alerts: object[];
    datetime: {
      ampm: 'PM' | 'AM';
      dateTime: string;
      dayNight: string;
      officialDate: string;
      originalDate: string;
      time: string;
    };
    flags: {
      awayTeamNoHitter: boolean;
      awayTeamPerfectGame: boolean;
      homeTeamNoHitter: boolean;
      homeTeamPerfectGame: boolean;
      noHitter: boolean;
      perfectGame: boolean;
    };
    game: {
      calendarEventID: string;
      doubleHeader: string;
      gameNumber: number;
      gamedayType: string;
      id: string;
      pk: number;
      season: string;
      seasonDisplay: string;
      tiebreaker: string;
      type: string;
    };
    gameInfo: {
      attendance: number;
      firstPitch: string;
      gameDurationMinutes: number;
    };
    officialScorer: Person;
    officialVenue: { id: number; link: string };
    players: MLBBoxScorePlayerDict;
    primaryDatacaster: Person;
    probablePitchers: {
      home: Person;
      away: Person;
    };
    review: {
      away: {
        used: number;
        remaining: number;
      };
      hasChallenges: boolean;
      home: {
        used: number;
        remaining: number;
      };
    };
    status: {
      abstractGameCode: string;
      abstractGameState: string;
      codedGameState: string;
      detailedState: string;
      startTimeTBD: boolean;
      statusCode: string;
    };
    teams: {
      away: MLBTeam;
      home: MLBTeam;
    };
    venue: {
      active: boolean;
      fieldInfo: {
        capacity: number;
        center: number;
        leftCenter: number;
        leftLine: number;
        rightCenter: number;
        rightLine: number;
        roofType: string;
        turfType: string;
      };
      id: number;
      link: string;
      location: {
        address1: string;
        city: string;
        country: string;
        defaultCoordinates: {
          latitude: number;
          longitude: number;
        };
        phone: string;
        postalCode: string;
        state: string;
        stateAbbrev: string;
      };
      name: string;
      timeZone: {
        id: string;
        offset: number;
        tz: string;
      };
    };
    weather: {
      condition: string;
      temp: string;
      wind: string;
    };
  };
  gamePk: number;
  link: string;
  liveData: {
    boxscore: {
      info: MLBNote[];
      officials: {
        official: Person;
        officialType:
          | 'Home Plate'
          | 'First Base'
          | 'Second Base'
          | 'Third Base';
      }[];
      pitchingNotes: string[];
      teams: {
        away: MLBBoxScoreTeam;
        home: MLBBoxScoreTeam;
      };
    };
    decisions: {
      loser?: Person;
      winner?: Person;
      save?: Person;
    };
    leaders: {
      hitDistance: object;
      hitSpeed: object;
      pitchSpeed: object;
    };
    linescore: {
      balls: number;
      currentInning: number;
      currentInningOrdinal: string;
      defense: MLBDefense;
      inningHalf: string;
      inningState: string;
      innings: MLBLineScoreInning[];
      isTopInning: boolean;
      offense: MLBOffense;
      outs: number;
      scheduledInnings: number;
      strikes: number;
      teams: {
        away: MLBLineScoreTeamStatus;
        home: MLBLineScoreTeamStatus;
      };
    };
    plays: MLBPlay[];
  };
  metaData: {
    gameEvents: string[];
    logicalEvents: string[];
    timeStamp: string;
    wait: number;
  };
}

export interface MLBNote {
  label: string;
  value?: string;
}

export interface Person {
  fullName: string;
  id: number;
  link: string;
}

export interface MLBPlay {
  about: {
    atBatIndex: number;
    captivatingIndex: number;
    endTime: string;
    halfInning: string;
    hasOut: boolean;
    hasReview: boolean;
    inning: number;
    isComplete: boolean;
    isScoringPlay: boolean;
    isTopInning: boolean;
    startTime: string;
  };
  actionIndex: number[];
  atBatIndex: number;
  count: Count;
  matchup: {
    batSide: { code: 'R' | 'L' | 'S'; description: string };
    batter: Person;
    batterHotColdZones: object;
    pitchHand: { code: 'R' | 'L'; description: string };
    pitcher: Person;
    pitcherHotColdZones: object;
    postOnFirst: Person;
    splits: {
      batter: string;
      pitcher: string;
      menOnBase: string;
    };
  };
  pitchIndex: number[];
  playEndTime: string;
  playEvents: {
    count: Count;
    details: {
      awayScore: number;
      description: string;
      event: string;
      eventType: string;
      hasReview: boolean;
      homeScore: number;
      isOut: boolean;
      isScoringPlay: boolean;
    };
    endTime: string;
    index: number;
    isPitch: boolean;
    player: { id: number; link: string };
    startTime: string;
    type: string;
  }[];
  result: {
    awayScore: number;
    description: string;
    event: string;
    eventType: string;
    homeScore: number;
    isOut: boolean;
    rbi: number;
    type: string;
  };
  runnerIndex: number[];
  runners: {
    credits: object[];
    details: {
      earned: boolean;
      event: string;
      eventType: string;
      isScoringEvent: boolean;
      movementReason?: string;
      playIndex: number;
      rbi: boolean;
      responsiblePitcher?: string;
      runner: Person;
      teamUnearned: boolean;
    };
    movement: {
      end: string;
      isOut: boolean;
      originBase?: string;
      outBase?: string;
      outNumber?: number;
      start?: string;
    };
  }[];
}

interface Count {
  balls: number;
  strikes: number;
  outs: number;
}

export interface MLBTeam {
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
}

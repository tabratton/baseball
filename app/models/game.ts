import { service } from '@ember/service';
import { cached, tracked } from '@glimmer/tracking';
import type IntlService from 'ember-intl/services/intl';

import Batter from 'baseball/models/batter';
import Pitcher from 'baseball/models/pitcher';
import type MlbApiService from 'baseball/services/mlb-api';
import type {
  BoxScorePlayer,
  BoxScoreTeam,
  GameFeed,
  InningHalf,
} from 'baseball/types/mlb-api';
import inheritOwner from 'baseball/utils/inherit-owner';
import teamMap from 'baseball/utils/team-map';

export interface GameTeam {
  name: string | undefined;
  short: string | undefined;
  locationName: string;
  teamName: string;
  bgClass: string | undefined;
  textClass: string | undefined;
  innings: InningHalf[];
  runs: number;
  hits: number;
  errors: number;
  batters: Batter[];
  pitchers: Pitcher[];
}

function playersFor(team: BoxScoreTeam, ids: number[]): BoxScorePlayer[] {
  return ids
    .map((id) => team.players[`ID${id}`])
    .filter((v): v is BoxScorePlayer => !!v);
}

export default class Game {
  @service declare intl: IntlService;
  @service declare mlbApi: MlbApiService;

  @tracked gameFeed: GameFeed;

  context: object;

  constructor(gameObj: GameFeed, context: object) {
    this.gameFeed = gameObj;
    this.context = context;
    inheritOwner(this, context);
  }

  async refreshData() {
    this.gameFeed = await this.mlbApi.fetchGameData(this.gamePk);
  }

  get gamePk() {
    return this.gameFeed.gamePk;
  }

  get lineScore() {
    return this.gameFeed.liveData.linescore;
  }

  get boxScore() {
    return this.gameFeed.liveData.boxscore;
  }

  get gameTime() {
    return Temporal.Instant.from(
      this.gameFeed.gameData.datetime.dateTime,
    ).toZonedDateTimeISO(Temporal.Now.timeZoneId());
  }

  #processInnings(innings: InningHalf[]) {
    if (this.lineScore.innings.length < this.lineScore.scheduledInnings) {
      for (
        let i = this.lineScore.innings.length;
        i < this.lineScore.scheduledInnings;
        i++
      ) {
        innings.push({ runs: undefined, hits: undefined, errors: undefined });
      }
    }

    const stats = {
      runs: 0,
      hits: 0,
      errors: 0,
    };

    innings.forEach((inning) => {
      stats.runs += inning.runs || 0;
      stats.hits += inning.hits || 0;
      stats.errors += inning.errors || 0;
    });

    return stats;
  }

  @cached
  get homeTeam(): GameTeam {
    const homeTeam = this.homeTeamMap;

    const innings = this.gameFeed.liveData.linescore.innings.map((i) => i.home);
    const stats = this.#processInnings(innings);

    const team: GameTeam = {
      name: homeTeam?.name,
      short: homeTeam?.short,
      locationName: this.homeTeamGameData.franchiseName,
      teamName: this.homeTeamGameData.clubName,
      bgClass: homeTeam?.mainBackground,
      textClass: homeTeam?.mainText,
      innings: innings,
      runs: stats.runs,
      hits: stats.hits,
      errors: stats.errors,
      batters: playersFor(
        this.boxScore.teams.home,
        this.boxScore.teams.home.batters,
      )
        .map((player) => new Batter(player, this.context))
        .filter((player) => player.plateAppearances !== undefined),
      pitchers: playersFor(
        this.boxScore.teams.home,
        this.boxScore.teams.home.pitchers,
      ).map((player) => new Pitcher(player, this.context)),
    };

    return team;
  }

  @cached
  get awayTeam(): GameTeam {
    const awayTeam = this.awayTeamMap;

    const innings = this.gameFeed.liveData.linescore.innings.map((i) => i.away);
    const stats = this.#processInnings(innings);

    const team: GameTeam = {
      name: awayTeam?.name,
      locationName: this.awayTeamGameData.franchiseName,
      teamName: this.awayTeamGameData.clubName,
      short: awayTeam?.short,
      bgClass: awayTeam?.mainBackground,
      textClass: awayTeam?.mainText,
      innings: innings,
      runs: stats.runs,
      hits: stats.hits,
      errors: stats.errors,
      batters: playersFor(
        this.boxScore.teams.away,
        this.boxScore.teams.away.batters,
      )
        .map((player) => new Batter(player, this.context))
        .filter((player) => player.plateAppearances !== undefined),
      pitchers: playersFor(
        this.boxScore.teams.away,
        this.boxScore.teams.away.pitchers,
      ).map((player) => new Pitcher(player, this.context)),
    };

    if (this.colorConflict) {
      team.bgClass = awayTeam?.secondaryBackground;
      team.textClass = awayTeam?.secondaryText;
    }

    return team;
  }

  @cached
  get homeTeamMap() {
    return teamMap.find((t) => t.id === this.homeTeamGameData.id);
  }

  get homeTeamGameData() {
    return this.gameFeed.gameData.teams.home;
  }

  @cached
  get awayTeamMap() {
    return teamMap.find((t) => t.id === this.awayTeamGameData.id);
  }

  get awayTeamGameData() {
    return this.gameFeed.gameData.teams.away;
  }

  @cached
  get colorConflict() {
    const awayShort = this.awayTeamMap?.short;
    return awayShort
      ? (this.homeTeamMap?.conflicts?.includes(awayShort) ?? false)
      : false;
  }

  get isPregame() {
    return this.statusCode === 'P';
  }

  get isOver() {
    return this.statusCode === 'F';
  }

  get inProgress() {
    return !this.isPregame && !this.isOver;
  }

  get gameDuration() {
    if (this.isOver) {
      return Temporal.Duration.from({
        hours: Math.floor(
          this.gameFeed.gameData.gameInfo.gameDurationMinutes / 60,
        ),
        minutes: this.gameFeed.gameData.gameInfo.gameDurationMinutes % 60,
      }).toLocaleString();
    } else if (this.inProgress) {
      const millis =
        Temporal.Now.instant().epochMilliseconds -
        Temporal.Instant.from(this.gameFeed.gameData.gameInfo.firstPitch)
          .epochMilliseconds;
      return Temporal.Duration.from({ milliseconds: millis })
        .round({
          largestUnit: 'hours',
          smallestUnit: 'minutes',
          roundingMode: 'trunc',
        })
        .toLocaleString();
    }

    return '';
  }

  get isTopInning() {
    return this.lineScore.isTopInning || false;
  }

  get inning() {
    return this.lineScore.currentInning;
  }

  get statusCode() {
    return this.gameFeed.gameData.status.abstractGameCode;
  }

  get outs() {
    const outs = this.lineScore.outs || 0;
    return this.inProgress ? [outs >= 1, outs >= 2] : [false, false];
  }

  get balls() {
    return this.lineScore.balls;
  }

  get strikes() {
    return this.lineScore.strikes;
  }

  get runners() {
    return [
      { num: 1, runner: this.lineScore.offense.first },
      { num: 2, runner: this.lineScore.offense.second },
      { num: 3, runner: this.lineScore.offense.third },
    ];
  }

  get batter() {
    const playerID = this.lineScore.offense.batter?.id;
    const players = this.isTopInning
      ? this.awayTeam.batters
      : this.homeTeam.batters;
    return players.find((player) => player.id === playerID);
  }

  get pitcher() {
    const playerID = this.lineScore.defense.pitcher?.id;
    const players = this.isTopInning
      ? this.homeTeam.pitchers
      : this.awayTeam.pitchers;
    return players.find((player) => player.id === playerID);
  }

  get formattedBattingOrder() {
    return this.batter
      ? `${Math.floor(Number(this.batter.battingOrder) / 100)}.`
      : '';
  }

  get winningPitcher() {
    return this.gameFeed.liveData.decisions?.winner?.fullName;
  }

  get losingPitcher() {
    return this.gameFeed.liveData.decisions?.loser?.fullName;
  }

  get save() {
    return this.gameFeed.liveData.decisions?.save?.fullName;
  }

  get awayTeamRecord() {
    return `${this.awayTeamGameData.record.wins}-${this.awayTeamGameData.record.losses}`;
  }

  get homeTeamRecord() {
    return `${this.homeTeamGameData.record.wins}-${this.homeTeamGameData.record.losses}`;
  }
}

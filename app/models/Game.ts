import { cached, tracked } from '@glimmer/tracking';

import { MLBGameFeed } from 'baseball/interfaces/MLBAPI/MLBGameFeed';
import teamMap from 'baseball/utils/teamMap';
import { MLBLineScoreTeamStatus } from 'baseball/interfaces/MLBAPI/MLBLineScore';
import { MLBBoxScorePlayer } from 'baseball/interfaces/MLBAPI/MLBBoxScore';
import { notEmpty } from 'baseball/utils/typescriptNotEmpty';
import { parseISO } from 'date-fns';

export default class Game {
  @tracked gameFeed: MLBGameFeed;

  constructor(gameObj: MLBGameFeed) {
    this.gameFeed = gameObj;
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
    return parseISO(this.gameFeed.gameData.datetime.dateTime);
  }

  #processInnings(innings: MLBLineScoreTeamStatus[]) {
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
  get homeTeam(): TeamInfo {
    const homeTeam = this.homeTeamMap;

    const innings = this.gameFeed.liveData.linescore.innings.map((i) => i.home);
    const stats = this.#processInnings(innings);

    const team = {
      name: homeTeam?.name,
      short: homeTeam?.short,
      bgClass:
        this.teamColorPriority === 'home'
          ? homeTeam?.mainBackground
          : homeTeam?.secondaryBackground,
      textClass:
        this.teamColorPriority === 'home'
          ? homeTeam?.mainText
          : homeTeam?.secondaryText,
      innings: innings,
      runs: stats.runs,
      hits: stats.hits,
      errors: stats.errors,
      batters: this.boxScore.teams.home.batters
        .map((id) => this.boxScore.teams.home.players[`ID${id}`])
        .filter(notEmpty),
      pitchers: this.boxScore.teams.home.pitchers
        .map((id) => this.boxScore.teams.home.players[`ID${id}`])
        .filter(notEmpty),
    };

    if (this.colorConflict) {
      team.bgClass =
        this.teamColorPriority === 'home'
          ? homeTeam?.mainBackground
          : homeTeam?.secondaryBackground;
      team.textClass =
        this.teamColorPriority === 'home'
          ? homeTeam?.mainText
          : homeTeam?.secondaryText;
    }

    return team;
  }

  @cached
  get awayTeam(): TeamInfo {
    const awayTeam = this.awayTeamMap;

    const innings = this.gameFeed.liveData.linescore.innings.map((i) => i.away);
    const stats = this.#processInnings(innings);

    const team = {
      name: awayTeam?.name,
      short: awayTeam?.short,
      bgClass: awayTeam?.mainBackground,
      textClass: awayTeam?.mainText,
      innings: innings,
      runs: stats.runs,
      hits: stats.hits,
      errors: stats.errors,
      batters: this.boxScore.teams.away.batters
        .map((id) => this.boxScore.teams.away.players[`ID${id}`])
        .filter(notEmpty),
      pitchers: this.boxScore.teams.away.pitchers
        .map((id) => this.boxScore.teams.away.players[`ID${id}`])
        .filter(notEmpty),
    };

    if (this.colorConflict) {
      team.bgClass =
        this.teamColorPriority === 'away'
          ? awayTeam?.mainBackground
          : awayTeam?.secondaryBackground;
      team.textClass =
        this.teamColorPriority === 'away'
          ? awayTeam?.mainText
          : awayTeam?.secondaryText;
    }

    return team;
  }

  @cached
  get homeTeamMap() {
    return teamMap.find((t) => t.id === this.gameFeed.gameData.teams.home.id);
  }

  @cached
  get awayTeamMap() {
    return teamMap.find((t) => t.id === this.gameFeed.gameData.teams.away.id);
  }

  @cached
  get colorConflict() {
    return this.homeTeamMap?.conflicts?.includes(this.homeTeamMap?.short);
  }

  get teamColorPriority() {
    return (this.awayTeamMap?.priority || Number.MAX_SAFE_INTEGER) <
      (this.homeTeamMap?.priority || Number.MAX_SAFE_INTEGER)
      ? 'away'
      : 'home';
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
    const playerID = this.lineScore.offense.batter.id;
    const players = this.isTopInning
      ? this.boxScore.teams.away.players
      : this.boxScore.teams.home.players;
    return players[`ID${playerID}`];
  }

  get pitcher() {
    const playerID = this.lineScore.defense.pitcher.id;
    const players = this.isTopInning
      ? this.boxScore.teams.home.players
      : this.boxScore.teams.away.players;
    return players[`ID${playerID}`];
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
}

export interface TeamInfo {
  name?: string;
  short?: string;
  bgClass?: string;
  textClass?: string;
  innings: MLBLineScoreTeamStatus[];
  runs: number;
  hits: number;
  errors: number;
  batters: MLBBoxScorePlayer[];
  pitchers: MLBBoxScorePlayer[];
}

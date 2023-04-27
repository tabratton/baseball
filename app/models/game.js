import { getOwner, setOwner } from '@ember/application';
import { service } from '@ember/service';
import { cached, tracked } from '@glimmer/tracking';

import { DateTime, Duration } from 'luxon';

import Batter from 'baseball/models/batter';
import Pitcher from 'baseball/models/pitcher';
import durationFormat from 'baseball/utils/duration-format';
import teamMap from 'baseball/utils/team-map';

export default class Game {
  @service intl;

  @tracked gameFeed;

  context;

  constructor(gameObj, context) {
    this.gameFeed = gameObj;
    this.context = context;
    setOwner(this, getOwner(context));
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
    return DateTime.fromISO(this.gameFeed.gameData.datetime.dateTime);
  }

  #processInnings(innings) {
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
  get homeTeam() {
    const homeTeam = this.homeTeamMap;

    const innings = this.gameFeed.liveData.linescore.innings.map((i) => i.home);
    const stats = this.#processInnings(innings);

    const team = {
      name: homeTeam?.name,
      short: homeTeam?.short,
      locationName: this.homeTeamGameData.locationName,
      teamName: this.homeTeamGameData.teamName,
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
        .filter((v) => v)
        .map((player) => new Batter(player, this.context))
        .filter((player) => player.plateAppearances !== undefined),
      pitchers: this.boxScore.teams.home.pitchers
        .map((id) => this.boxScore.teams.home.players[`ID${id}`])
        .filter((v) => v)
        .map((player) => new Pitcher(player, this.context)),
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
  get awayTeam() {
    const awayTeam = this.awayTeamMap;

    const innings = this.gameFeed.liveData.linescore.innings.map((i) => i.away);
    const stats = this.#processInnings(innings);

    const team = {
      name: awayTeam?.name,
      locationName: this.awayTeamGameData.locationName,
      teamName: this.awayTeamGameData.teamName,
      short: awayTeam?.short,
      bgClass: awayTeam?.mainBackground,
      textClass: awayTeam?.mainText,
      innings: innings,
      runs: stats.runs,
      hits: stats.hits,
      errors: stats.errors,
      batters: this.boxScore.teams.away.batters
        .map((id) => this.boxScore.teams.away.players[`ID${id}`])
        .filter((v) => v)
        .map((player) => new Batter(player, this.context))
        .filter((player) => player.plateAppearances !== undefined),
      pitchers: this.boxScore.teams.away.pitchers
        .map((id) => this.boxScore.teams.away.players[`ID${id}`])
        .filter((v) => v)
        .map((player) => new Pitcher(player, this.context)),
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

  get gameDuration() {
    if (this.isOver) {
      return durationFormat(
        Duration.fromObject({
          hours: Math.floor(
            this.gameFeed.gameData.gameInfo.gameDurationMinutes / 60
          ),
          minutes: this.gameFeed.gameData.gameInfo.gameDurationMinutes % 60,
        })
      );
    } else if (this.inProgress) {
      const millis =
        DateTime.now() -
        DateTime.fromISO(this.gameFeed.gameData.gameInfo.firstPitch);
      const duration = Duration.fromMillis(millis).rescale();
      return durationFormat(
        duration
          .minus(duration.milliseconds)
          .minus(duration.seconds * 1000)
          .rescale()
      );
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
    const playerID = this.lineScore.offense.batter.id;
    const players = this.isTopInning
      ? this.awayTeam.batters
      : this.homeTeam.batters;
    return players.find((player) => player.id === playerID);
  }

  get pitcher() {
    const playerID = this.lineScore.defense.pitcher.id;
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

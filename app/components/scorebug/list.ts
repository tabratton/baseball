import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { compareAsc, format, parseISO } from 'date-fns';
import { task, timeout } from 'ember-concurrency';
import fetch from 'fetch';
import { all, hash } from 'rsvp';

import teamMap from 'baseball/utils/teamMap';

import type { MappedScorebug } from 'baseball/interfaces/MappedScorebug';
import type { MappedGame } from 'baseball/interfaces/MappedGame';
import type { MLBBoxScore } from 'baseball/interfaces/MLBAPI/MLBBoxScore';
import type { MLBLineScore } from 'baseball/interfaces/MLBAPI/MLBLineScore';
import type { MLBScheduleEntry } from 'baseball/interfaces/MLBAPI/MLBScheduleEntry';
import type { TeamConfigEntry } from 'baseball/interfaces/TeamConfigEntry';

interface ScorebugListArgs {
  date: Date;
}

import { notEmpty } from 'baseball/utils/typescriptNotEmpty';

export default class ScorebugList extends Component<ScorebugListArgs> {
  @tracked loading = false;
  @tracked games: MappedGame[] | undefined;

  // constructor(owner: unknown, args: ScorebugListArgs) {
  //   super(owner, args);
  //   this.getData();
  // }

  // @action
  getData = task({ restartable: true }, async () => {
    this.loading = true;

    try {
      this.games = await this.getGamesForDay(format(this.args.date, 'y-MM-dd'));
    } catch (ex) {
      this.games = [];
    } finally {
      this.loading = false;
    }
  });

  get scorebugGames() {
    return this.games
      ?.map((game) => {
        if (!game) return null;
        return this.getScorebug(game);
      })
      .filter(notEmpty)
      .sort((a, b) => compareAsc(a.gameTime, b.gameTime));
  }

  get inProgress() {
    return this.scorebugGames
      ?.filter((game) => game.inProgress)
      .sort((a, b) =>
        a.inning > b.inning ? 1 : a.inning === b.inning ? 0 : -1
      );
  }

  get notInProgress() {
    return this.scorebugGames?.filter((game) => !game.inProgress);
  }

  getScorebug(game: MappedGame) {
    const isPregame = game.schedule.status.abstractGameCode === 'P';
    const obj: MappedScorebug = {
      gamePk: game.gamePk,
      isTop: game.lineScore?.isTopInning || false,
      inProgress: game.inProgress,
      isPregame,
      gameTime: game.gameTime,
      gameDate: game.gameDate,
      home: {
        team: game.home.short,
        bgClass: game.home.bgClass,
        textClass: game.home.textClass,
        score: game.lineScore?.teams.home.runs || 0,
      },
      away: {
        team: game.away.short,
        bgClass: game.away.bgClass,
        textClass: game.away.textClass,
        score: game.lineScore?.teams.away.runs || 0,
      },
      displaySide: false,
      statusCode: game.schedule.status.abstractGameCode,
      outs: [false, false],
      runners: [
        { num: 1, runner: false },
        { num: 2, runner: false },
        { num: 3, runner: false },
      ],
      inning: 0,
    };

    if (obj.isTop) {
      obj.home.currentPlayer =
        game.boxScore?.teams.home.players[
          `ID${game.lineScore?.defense.pitcher?.id}`
        ];
      obj.away.currentPlayer =
        game.boxScore?.teams.away.players[
          `ID${game.lineScore?.offense.batter?.id}`
        ];
      obj.away.order = obj.away.currentPlayer
        ? `${Math.floor(Number(obj.away.currentPlayer.battingOrder) / 100)}.`
        : '';
    } else {
      obj.home.currentPlayer =
        game.boxScore?.teams.home.players[
          `ID${game.lineScore?.offense.batter?.id}`
        ];
      obj.away.currentPlayer =
        game.boxScore?.teams.away.players[
          `ID${game.lineScore?.defense.pitcher?.id}`
        ];
      obj.home.order = obj.home.currentPlayer
        ? `${Math.floor(Number(obj.home.currentPlayer.battingOrder) / 100)}.`
        : '';
    }

    if (obj.inProgress) {
      obj.inning = game.lineScore?.currentInning || 0;
      obj.displaySide = true;
      obj.batterCount = `${game.lineScore?.balls}-${game.lineScore?.strikes}`;
      obj.outs = [
        (game.lineScore?.outs || 0) >= 1,
        (game.lineScore?.outs || 0) >= 2,
      ];
      obj.runners = [
        { num: 1, runner: !!game.lineScore?.offense.first },
        { num: 2, runner: !!game.lineScore?.offense.second },
      ];
    }

    return obj;
  }

  getGamesForDay(day: string): Promise<MappedGame[]> {
    return fetch(
      encodeURI(
        `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${day}`
      )
    )
      .then((response) => {
        if (response.status !== 200) {
          return;
        }

        return response
          .json()
          .then(({ dates: [dateData] }) => dateData?.games || []);
      })
      .then((scheduleData: MLBScheduleEntry[]) =>
        all(scheduleData.map((d: MLBScheduleEntry) => this.getGame(d)))
      );
  }

  getGame(schedule: MLBScheduleEntry): Promise<MappedGame> {
    const homeTeam = teamMap.find(
      (t: TeamConfigEntry) => t.id === schedule.teams.home.team.id
    );
    const awayTeam = teamMap.find(
      (t: TeamConfigEntry) => t.id === schedule.teams.away.team.id
    );

    const isOver = schedule.status.abstractGameCode === 'F';
    const isPregame = schedule.status.abstractGameCode === 'P';

    const colorConflict =
      homeTeam?.conflicts && awayTeam
        ? homeTeam.conflicts.includes(awayTeam.short)
        : false;
    let teamPriority = 'home';

    if (
      (awayTeam?.priority || Number.MAX_SAFE_INTEGER) <
      (homeTeam?.priority || Number.MAX_SAFE_INTEGER)
    ) {
      teamPriority = 'away';
    }

    const gameObj = {
      lineScore: fetch(
        `https://statsapi.mlb.com/api/v1/game/${schedule.gamePk}/linescore`
      ).then((response) => {
        if (response.status !== 200) {
          return;
        }

        return response.json().then((data: MLBLineScore) => data);
      }),
      boxScore: fetch(
        `https://statsapi.mlb.com/api/v1/game/${schedule.gamePk}/boxscore`
      ).then((response) => {
        if (response.status !== 200) {
          return;
        }

        return response.json().then((data: MLBBoxScore) => data);
      }),
      schedule,
      gamePk: `${schedule.gamePk}`,
      gameTime: parseISO(schedule.gameDate),
      inProgress: !isOver && !isPregame,
      home: {
        short: homeTeam?.short.toUpperCase(),
        name: homeTeam?.name,
        bgClass: homeTeam?.mainBackground,
        textClass: homeTeam?.mainText,
      },
      away: {
        short: awayTeam?.short.toUpperCase(),
        name: awayTeam?.name,
        bgClass: awayTeam?.mainBackground,
        textClass: awayTeam?.mainText,
      },
      gameDate: '',
    };

    gameObj.gameDate = format(gameObj.gameTime, 'yyyy-MM-dd');

    if (colorConflict) {
      if (teamPriority === 'home') {
        gameObj.home.bgClass = homeTeam?.mainBackground;
        gameObj.home.textClass = homeTeam?.mainText;
        gameObj.away.bgClass = awayTeam?.secondaryBackground;
        gameObj.away.textClass = awayTeam?.secondaryText;
      } else {
        gameObj.home.bgClass = homeTeam?.secondaryBackground;
        gameObj.home.textClass = homeTeam?.secondaryText;
        gameObj.away.bgClass = awayTeam?.mainBackground;
        gameObj.away.textClass = awayTeam?.mainText;
      }
    }

    return hash(gameObj);
  }
}

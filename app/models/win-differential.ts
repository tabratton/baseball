import { service } from '@ember/service';
import { cached, tracked } from '@glimmer/tracking';
import type IntlService from 'ember-intl/services/intl';

import type { ScheduleGameTeam } from 'baseball/types/mlb-api';
import inheritOwner from 'baseball/utils/inherit-owner';
import type { TeamConfig } from 'baseball/utils/team-map';

/** A team's result for a single completed game. */
export type GameResult = ScheduleGameTeam & { date: string };

export interface SeasonDiff {
  date: Temporal.ZonedDateTime;
  diff: number;
  count: number;
  isWinner: boolean | undefined;
}

export default class WinDifferential {
  @service declare intl: IntlService;

  @tracked team: TeamConfig;
  @tracked scheduleMap: GameResult[];
  @tracked selected = true;

  constructor(team: TeamConfig, scheduleMap: GameResult[], context: object) {
    this.team = team;
    this.scheduleMap = scheduleMap;
    inheritOwner(this, context);
  }

  get logo() {
    return `/assets/team_logos/${this.team.short?.toLowerCase()}.svg`;
  }

  get overallDiff() {
    return this.seasonDiffs[this.seasonDiffs.length - 1]?.diff || 0;
  }

  @cached
  get seasonDiffs(): SeasonDiff[] {
    let diff = 0;
    let count = 0;

    const firstGame = this.scheduleMap[0];
    if (!firstGame) {
      return [];
    }

    return [
      {
        date: Temporal.PlainDate.from(firstGame.date)
          .toZonedDateTime(Temporal.Now.timeZoneId())
          .subtract({
            days: 1,
          }),
        diff: 0,
        count: 0,
        isWinner: false,
      },
      ...this.scheduleMap.reduce<SeasonDiff[]>((accumulator, g) => {
        count += 1;
        diff = diff + (g.isWinner ? 1 : -1);
        const acc = {
          date: Temporal.PlainDate.from(g.date).toZonedDateTime(
            Temporal.Now.timeZoneId(),
          ),
          diff,
          count,
          isWinner: g.isWinner,
        };
        accumulator.push(acc);
        return accumulator;
      }, []),
    ];
  }
}

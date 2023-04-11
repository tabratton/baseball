import { getOwner, setOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import { cached, tracked } from '@glimmer/tracking';
import { parse, subDays } from 'date-fns';

import type IntlService from 'ember-intl/services/intl';

import type { TeamConfigEntry } from 'baseball/interfaces/TeamConfigEntry';
import type { MLBScheduleTeamMap } from 'baseball/services/mlb-api';

export default class WinDifferential {
  @service declare intl: IntlService;
  @tracked team: TeamConfigEntry;
  @tracked scheduleMap: MLBScheduleTeamMap[];
  @tracked selected = true;

  private readonly context;

  constructor(
    team: TeamConfigEntry,
    scheduleMap: MLBScheduleTeamMap[],
    context: unknown
  ) {
    this.team = team;
    this.scheduleMap = scheduleMap;
    this.context = context;
    setOwner(this, getOwner(context));
  }

  get logo() {
    return `/assets/team_logos/${this.team.short?.toLowerCase()}.svg`;
  }

  get overallDiff() {
    return this.seasonDiffs[this.seasonDiffs.length - 1]?.diff || 0;
  }

  @cached
  get seasonDiffs() {
    let diff = 0;
    let count = 0;

    return [
      {
        date: subDays(
          parse(this.scheduleMap[0]?.date || '', 'yyyy-MM-dd', new Date()),
          1
        ),
        diff: 0,
        count: 0,
        isWinner: false,
      },
      ...this.scheduleMap.reduce(
        (accumulator: DifferentialReduction[], g: MLBScheduleTeamMap) => {
          count += 1;
          diff = diff + (g.isWinner ? 1 : -1);
          const acc = {
            date: parse(g.date, 'yyyy-MM-dd', new Date()),
            diff,
            count,
            isWinner: g.isWinner,
          };
          accumulator.push(acc);
          return accumulator;
        },
        []
      ),
    ];
  }
}

export interface DifferentialReduction {
  date: Date;
  diff: number;
  count: number;
  isWinner: boolean;
}

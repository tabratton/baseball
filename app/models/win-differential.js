import { getOwner, setOwner } from '@ember/application';
import { service } from '@ember/service';
import { cached, tracked } from '@glimmer/tracking';

import { DateTime } from 'luxon';

export default class WinDifferential {
  @service intl;

  @tracked team;
  @tracked scheduleMap;
  @tracked selected = true;

  constructor(team, scheduleMap, context) {
    this.team = team;
    this.scheduleMap = scheduleMap;
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
        date: DateTime.fromISO(this.scheduleMap[0]?.date || '').minus({
          days: 1,
        }),
        diff: 0,
        count: 0,
        isWinner: false,
      },
      ...this.scheduleMap.reduce((accumulator, g) => {
        count += 1;
        diff = diff + (g.isWinner ? 1 : -1);
        const acc = {
          date: DateTime.fromISO(g.date),
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

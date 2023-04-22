import { getOwner, setOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import { cached, tracked } from '@glimmer/tracking';

import { parse, subDays } from 'date-fns';

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
        date: subDays(
          parse(this.scheduleMap[0]?.date || '', 'yyyy-MM-dd', new Date()),
          1
        ),
        diff: 0,
        count: 0,
        isWinner: false,
      },
      ...this.scheduleMap.reduce((accumulator, g) => {
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
      }, []),
    ];
  }
}

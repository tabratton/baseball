import { getOwner, setOwner } from '@ember/owner';
import { service } from '@ember/service';
import { cached, tracked } from '@glimmer/tracking';

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
        date: Temporal.PlainDate.from(this.scheduleMap[0]?.date)
          .toZonedDateTime(Temporal.Now.timeZoneId())
          .subtract({
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
          date: Temporal.PlainDate.from(g.date).toZonedDateTime(Temporal.Now.timeZoneId()),
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

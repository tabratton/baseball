import { getOwner, setOwner } from '@ember/owner';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class Batter {
  @service intl;
  @tracked batter;

  constructor(batter, context) {
    this.batter = batter;
    setOwner(this, getOwner(context));
  }

  get avg() {
    return this.intl
      .formatNumber(
        (this.batter.stats.batting.hits || 0) /
          (this.batter.stats.batting.atBats || 1),
        {
          style: 'decimal',
          maximumFractionDigits: 3,
          minimumFractionDigits: 3,
        }
      )
      .replace(/^0/, '');
  }

  get hits() {
    return this.batter.stats.batting.hits;
  }

  get singles() {
    return this.hits - this.doubles - this.triples - this.homeRuns;
  }

  get doubles() {
    return this.batter.stats.batting.doubles;
  }

  get triples() {
    return this.batter.stats.batting.triples;
  }

  get homeRuns() {
    return this.batter.stats.batting.homeRuns;
  }

  get battingOrderSort() {
    return Number(this.batter.battingOrder) / 100;
  }

  get battingOrder() {
    return Number.isInteger(this.battingOrderSort)
      ? `${this.battingOrderSort}.`
      : '';
  }

  get position() {
    return this.batter.position.abbreviation;
  }

  get id() {
    return this.batter.person.id;
  }

  get number() {
    return this.batter.jerseyNumber;
  }

  get atBats() {
    return this.batter.stats.batting.atBats;
  }

  get runs() {
    return this.batter.stats.batting.runs;
  }

  get baseOnBalls() {
    return this.batter.stats.batting.baseOnBalls;
  }

  get rbi() {
    return this.batter.stats.batting.rbi;
  }

  get hitByPitch() {
    return this.batter.stats.batting.hitByPitch;
  }

  get fullName() {
    return this.batter.person.fullName;
  }

  get firstName() {
    const lastSpace = this.fullName.lastIndexOf(' ');
    return this.fullName.slice(0, lastSpace);
  }

  get lastName() {
    const lastSpace = this.fullName.lastIndexOf(' ');
    return this.fullName.slice(lastSpace);
  }

  get plateAppearances() {
    return this.batter.stats.batting.plateAppearances;
  }
}

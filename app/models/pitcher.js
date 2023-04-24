import { getOwner, setOwner } from '@ember/application';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class Pitcher {
  @service intl;
  @tracked pitcher;

  constructor(pitcher, context) {
    this.pitcher = pitcher;
    setOwner(this, getOwner(context));
  }

  get id() {
    return this.pitcher.person.id;
  }

  get number() {
    return this.pitcher.jerseyNumber;
  }

  get inningsPitched() {
    return this.pitcher.stats.pitching.inningsPitched;
  }

  get hits() {
    return this.pitcher.stats.pitching.hits;
  }

  get earnedRuns() {
    return this.pitcher.stats.pitching.earnedRuns;
  }

  get strikeOuts() {
    return this.pitcher.stats.pitching.strikeOuts;
  }

  get baseOnBalls() {
    return this.pitcher.stats.pitching.baseOnBalls;
  }

  get balls() {
    return this.pitcher.stats.pitching.balls;
  }

  get strikes() {
    return this.pitcher.stats.pitching.strikes;
  }

  get pitchesThrown() {
    return this.pitcher.stats.pitching.pitchesThrown;
  }

  get ballsAndStrikes() {
    return this.balls / this.strikes;
  }

  get fullName() {
    return this.pitcher.person.fullName;
  }

  get firstName() {
    const lastSpace = this.fullName.lastIndexOf(' ');
    return this.fullName.slice(0, lastSpace);
  }

  get lastName() {
    const lastSpace = this.fullName.lastIndexOf(' ');
    return this.fullName.slice(lastSpace);
  }

  get era() {
    return this.intl.formatNumber(
      ((this.earnedRuns || 0) * 9) / (this.inningsPitched || 1),
      {
        style: 'decimal',
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }
    );
  }
}

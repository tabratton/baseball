import { getOwner, setOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

import type IntlService from 'ember-intl/services/intl';
import type { MLBBoxScorePlayer } from 'baseball/interfaces/MLBAPI/MLBBoxScore';

export default class Pitcher {
  @service declare intl: IntlService;
  @tracked pitcher: MLBBoxScorePlayer;

  private readonly context;

  constructor(pitcher: MLBBoxScorePlayer, context: unknown) {
    this.pitcher = pitcher;
    this.context = context;
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

  get ballsAndStrikes() {
    return this.balls / this.strikes;
  }

  get fullName() {
    return this.pitcher.person.fullName;
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

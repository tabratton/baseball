import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

import type { StandingsModel } from 'baseball/routes/standings';

export default class Standings extends Controller {
  declare model: StandingsModel;

  queryParams = ['date'];

  @tracked selectedDate = Temporal.Now.plainDateISO();

  get date() {
    return this.selectedDate.toString();
  }

  set date(value: string) {
    this.selectedDate = Temporal.PlainDate.from(value);
  }

  get maxDate() {
    return Temporal.Now.plainDateISO();
  }

  get isRegularSeason() {
    return this.model.regularSeasonInterval?.contains(this.selectedDate);
  }

  get isPostSeason() {
    return this.model.postSeasonInterval?.contains(this.selectedDate);
  }
}

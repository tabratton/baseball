import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

import { DateTime } from 'luxon';

export default class Index extends Controller {
  queryParams = ['date'];

  @tracked selectedDate = DateTime.now();

  get date() {
    return this.selectedDate.toFormat('y-MM-dd');
  }

  set date(value) {
    this.selectedDate = DateTime.fromFormat(value, 'y-MM-dd');
  }
}

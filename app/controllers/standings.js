import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

import { format, parse } from 'date-fns';

export default class Standings extends Controller {
  queryParams = ['date'];

  @tracked selectedDate = new Date();

  get date() {
    return format(this.selectedDate, 'yyyy-MM-dd');
  }

  set date(value) {
    this.selectedDate = parse(value, 'yyyy-MM-dd', new Date());
  }

  get maxDate() {
    return new Date();
  }
}

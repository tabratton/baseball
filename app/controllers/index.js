import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

import { format, parse } from 'date-fns';

import './application.css';

export default class Index extends Controller {
  queryParams = ['date'];

  @tracked selectedDate = new Date();

  get date() {
    return format(this.selectedDate, 'yyyy-MM-dd');
  }

  set date(value) {
    this.selectedDate = parse(value, 'yyyy-MM-dd', new Date());
  }
}

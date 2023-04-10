import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

import { format, parse } from 'date-fns';

import './application.css';

export default class Standings extends Controller {
  queryParams = [
    {
      date: { type: 'string' as const },
    },
  ];

  @tracked selectedDate: Date = new Date();

  get date() {
    return format(this.selectedDate, 'yyyy-MM-dd');
  }

  set date(value: string) {
    this.selectedDate = parse(value, 'yyyy-MM-dd', new Date());
  }

  get maxDate() {
    return new Date();
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    standings: Standings;
  }
}

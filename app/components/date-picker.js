import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { DateTime } from 'luxon';

export default class DatePicker extends Component {
  @tracked center = this.args.date;

  get date() {
    return this.args.date || DateTime.now();
  }

  get dateDisplay() {
    return this.date.toFormat('y-MM-dd');
  }

  get maxDate() {
    return this.args.maxDate || undefined;
  }

  @action
  updateDate(close, epcDate) {
    this.args.onUpdate(epcDate.datetime);
    close();
  }

  @action
  updateCenter(epcDate) {
    this.center = epcDate.datetime;
  }
}

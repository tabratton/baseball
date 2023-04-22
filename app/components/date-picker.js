import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { format } from 'date-fns';

export default class DatePicker extends Component {
  @tracked center = this.args.date;

  get date() {
    return this.args.date || new Date();
  }

  get dateDisplay() {
    return format(this.date, 'yyyy-MM-dd');
  }

  get maxDate() {
    return this.args.maxDate || undefined;
  }

  @action
  updateDate(close, epcDate) {
    this.args.onUpdate(epcDate.date);
    close();
  }

  @action
  updateCenter(epcDate) {
    this.center = epcDate.date;
  }
}

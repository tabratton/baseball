import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { format } from 'date-fns';

interface DatePickerArgs {
  date: Date;
  maxDate: Date;
  onUpdate: (arg0: Date) => void;
}

export default class DatePicker extends Component<DatePickerArgs> {
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
  updateDate(close: () => void, epcDate: EmberPowerCalendarDate) {
    this.args.onUpdate(epcDate.date);
    close();
  }

  @action
  updateCenter(epcDate: EmberPowerCalendarDate) {
    this.center = epcDate.date;
  }
}

interface EmberPowerCalendarDate {
  date: Date;
  id: string;
  isCurrentMonth: boolean;
  isDisabled: boolean;
  isFocused: boolean;
  isSelected: boolean;
  isToday: boolean;
  number: number;
}

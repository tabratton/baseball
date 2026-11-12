import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { restartableTask, timeout } from 'ember-concurrency';
import perform from 'ember-concurrency/helpers/perform';

interface DatePickerSignature {
  Args: {
    date?: Temporal.PlainDate;
    maxDate?: Temporal.PlainDate;
    onUpdate: (date: Temporal.PlainDate) => void;
  };
}

export default class DatePicker extends Component<DatePickerSignature> {
  <template>
    <span class="date-picker">
      <label class="hidden" for="date-picker">date picker</label>
      <input
        id="date-picker"
        class="bg-stone-800 border-2 border-stone-50 rounded [color-scheme:dark]"
        type="date"
        max={{this.maxDate}}
        value={{this.date}}
        {{on "input" (perform this.updateDate)}}
      />
    </span>
  </template>

  get date() {
    return (this.args.date || Temporal.Now.plainDateISO()).toString();
  }

  get maxDate() {
    return this.args.maxDate?.toString();
  }

  updateDate = restartableTask(async (event: Event) => {
    await timeout(250);
    const newDate = Temporal.PlainDate.from(
      (event.target as HTMLInputElement).value,
    );
    this.args.onUpdate(newDate);
  });
}

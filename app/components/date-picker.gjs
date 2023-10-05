import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { restartableTask, timeout } from 'ember-concurrency';
import perform from 'ember-concurrency/helpers/perform';
import { DateTime } from 'luxon';

export default class DatePicker extends Component {
  <template>
    <span class="date-picker">
      <label class="hidden" for="date-picker">date picker</label>
      <input
        id="date-picker"
        class="bg-gray-900 border-2 border-stone-50 rounded [color-scheme:dark]"
        type="date"
        max={{this.max}}
        value={{this.date}}
        {{on "input" (perform this.updateDate)}}
      />
    </span>

  </template>

  get date() {
    return (this.args.date || DateTime.now()).toFormat('y-MM-dd');
  }

  get maxDate() {
    return this.args.maxDate?.toFormat('y-MM-dd');
  }

  updateDate = restartableTask(async (event) => {
    await timeout(250);
    const newDate = DateTime.fromISO(event.target.value);
    this.args.onUpdate(newDate);
  });
}

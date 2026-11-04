import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class Index extends Controller {
  queryParams = ['date'];

  @tracked selectedDate = Temporal.Now.plainDateISO();

  get date() {
    return this.selectedDate.toString();
  }

  set date(value) {
    this.selectedDate = Temporal.PlainDate.from(value);
  }
}

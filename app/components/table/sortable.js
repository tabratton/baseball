import { action, get } from '@ember/object';
import { compare } from '@ember/utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class Sortable extends Component {
  @tracked sortField = this.args.headers[0]?.field || '';
  @tracked sortDirection = 'asc';

  get sortedItems() {
    return this.args.items?.slice().sort((a, b) => {
      const result = compare(get(a, this.sortField), get(b, this.sortField));
      return this.sortDirection === 'desc' ? -1 * result : result;
    });
  }

  @action
  sort(field) {
    if (field === this.sortField) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortDirection = 'asc';
    }

    this.sortField = field;
  }
}

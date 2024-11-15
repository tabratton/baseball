import { fn, hash } from '@ember/helper';
import { on } from '@ember/modifier';
import { action, get } from '@ember/object';
import { compare } from '@ember/utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import eq from 'ember-truth-helpers/helpers/eq';

import Chevron from './chevron';

const Header = <template>
  <th
    class='cursor-pointer whitespace-nowrap border-2 border-stone-50 py-1 px-2 sm:px-3'
    ...attributes
  >
    <span role='button' {{on 'click' (fn @sort @field)}}>
      {{yield}}
      {{#if (eq @sortField @field)}}
        <Chevron
          class='inline'
          role='presentation'
          @isUp={{eq @sortDirection 'asc'}}
        />
      {{/if}}
    </span>
  </th>
</template>;

const Row = <template>
  <tr ...attributes>
    {{yield}}
  </tr>
</template>;

const Cell = <template>
  <td
    class='border-l-2 border-r-2 border-stone-50 py-1 px-2 sm:px-3'
    ...attributes
  >
    {{yield}}
  </td>
</template>;

export default class SortableTable extends Component {
  <template>
    <table class='table-auto text-center' ...attributes>
      {{yield to='caption'}}
      <thead>
        <tr class={{@headerClasses}}>
          {{#each @headers as |header index|}}
            {{yield
              (hash
                Header=(component
                  Header
                  sort=this.sort
                  field=header.field
                  sortField=this.sortField
                  sortDirection=this.sortDirection
                )
                header=header
                index=index
              )
              to='header'
            }}
          {{/each}}
        </tr>
      </thead>
      <tbody>
        {{#each this.sortedItems as |listItem index|}}
          {{yield
            (hash
              Row=(component Row)
              Cell=(component Cell)
              item=listItem
              index=index
            )
            to='row'
          }}
        {{/each}}
        {{yield}}
      </tbody>
    </table>
  </template>

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

import type { TOC } from '@ember/component/template-only';
import { fn, hash } from '@ember/helper';
import { on } from '@ember/modifier';
import { action, get } from '@ember/object';
import { compare } from '@ember/utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type { WithBoundArgs } from '@glint/template';

import eq from 'ember-truth-helpers/helpers/eq';

import Chevron from './chevron';

type SortDirection = 'asc' | 'desc';

export interface TableHeader {
  label: string;
  /** Path (relative to each item) used to sort the column. */
  field?: string;
  class?: string;
}

interface HeaderSignature {
  Element: HTMLTableCellElement;
  Args: {
    sort: (field: string | undefined) => void;
    field: string | undefined;
    sortField: string | undefined;
    sortDirection: SortDirection;
  };
  Blocks: { default: [] };
}

const Header: TOC<HeaderSignature> = <template>
  <th
    class="cursor-pointer whitespace-nowrap border-2 border-stone-50 py-1 px-2 sm:px-3"
    ...attributes
  >
    <span role="button" {{on "click" (fn @sort @field)}}>
      {{yield}}
      {{#if (eq @sortField @field)}}
        <Chevron role="presentation" @isUp={{eq @sortDirection "asc"}} />
      {{/if}}
    </span>
  </th>
</template>;

const Row: TOC<{
  Element: HTMLTableRowElement;
  Blocks: { default: [] };
}> = <template>
  <tr ...attributes>
    {{yield}}
  </tr>
</template>;

const Cell: TOC<{
  Element: HTMLTableCellElement;
  Blocks: { default: [] };
}> = <template>
  <td
    class="border-l-2 border-r-2 border-stone-50 py-1 px-2 sm:px-3"
    ...attributes
  >
    {{yield}}
  </td>
</template>;

interface SortableTableSignature<T, H extends TableHeader> {
  Element: HTMLTableElement;
  Args: {
    items: readonly T[] | null | undefined;
    headers: readonly H[];
    headerClasses?: string;
  };
  Blocks: {
    caption: [];
    header: [
      {
        Header: WithBoundArgs<
          typeof Header,
          'sort' | 'field' | 'sortField' | 'sortDirection'
        >;
        header: H;
        index: number;
      },
    ];
    row: [
      {
        Row: typeof Row;
        Cell: typeof Cell;
        item: T;
        index: number;
      },
    ];
    default: [];
  };
}

export default class SortableTable<
  T,
  H extends TableHeader = TableHeader,
> extends Component<SortableTableSignature<T, H>> {
  <template>
    <table class="table-auto text-center" ...attributes>
      {{yield to="caption"}}
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
              to="header"
            }}
          {{/each}}
        </tr>
      </thead>
      <tbody>
        {{#each this.sortedItems as |listItem index|}}
          {{yield (hash Row=Row Cell=Cell item=listItem index=index) to="row"}}
        {{/each}}
        {{yield}}
      </tbody>
    </table>
  </template>

  @tracked sortField: string | undefined = this.args.headers[0]?.field || '';
  @tracked sortDirection: SortDirection = 'asc';

  get sortedItems() {
    return this.args.items?.slice().sort((a, b) => {
      const field = this.sortField ?? '';
      const result = compare(get(a, field), get(b, field));
      return this.sortDirection === 'desc' ? -1 * result : result;
    });
  }

  @action
  sort(field: string | undefined) {
    if (field === this.sortField) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortDirection = 'asc';
    }

    this.sortField = field;
  }
}

import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { cached, tracked } from '@glimmer/tracking';

import eq from 'ember-truth-helpers/helpers/eq';
import mod from 'ember-math-helpers/helpers/mod';

import DiffChart from './diff-chart';
import SortableTable from './sortable-table';

class StandingsTable extends Component {
  <template>
    <div class="mx-auto overflow-auto">
      <div
        class='text-center font-bold cursor-pointer bg-stone-900 p-2 w-full'
        role='button'
        {{on 'click' (fn @onHeaderClick @standings.division)}}
      >
        {{@standings.division.nameShort}}
      </div>
      <div class='overflow-auto'>
        <SortableTable
          class='border-collapse border-none mb-4'
          @items={{@standings.teamRecords}}
          @headers={{this.headers}}
          @headerClasses='bg-stone-800'
          ...attributes
        >
          <:header as |h|>
            <h.Header class='border-none {{h.header.class}}'>
              {{h.header.label}}
            </h.Header>
          </:header>
          <:row as |row|>
            <row.Row
              class={{if (eq (mod row.index 2) 0) 'bg-stone-700' 'bg-stone-800'}}
            >
              <row.Cell class='border-none'>{{row.item.divisionRank}}</row.Cell>
              <row.Cell class='border-none'>
                <span class='flex items-center justify-center'>
                  <img
                    class='h-6 mr-2'
                    src={{row.item.teamLogo}}
                    alt={{row.item.teamName}}
                  />
                  <abbr title={{row.item.teamName}} class='text-sm'>
                    {{row.item.teamShortName}}
                  </abbr>
                </span>
              </row.Cell>
              <row.Cell class='border-none'>{{row.item.wins}}</row.Cell>
              <row.Cell class='border-none'>{{row.item.losses}}</row.Cell>
              <row.Cell class='border-none'>{{row.item.pct}}</row.Cell>
              <row.Cell class='border-none'>{{row.item.gamesBack}}</row.Cell>
              <row.Cell class='border-none'>{{row.item.wildCardGamesBack}}</row.Cell>
              <row.Cell class='border-none'>{{row.item.runsScored}}</row.Cell>
              <row.Cell class='border-none'>{{row.item.runsAllowed}}</row.Cell>
              <row.Cell class='border-none'>{{row.item.runDifferential}}</row.Cell>
            </row.Row>
          </:row>
        </SortableTable>
      </div>
    </div>
  </template>

  get headers() {
    return [
      { label: '#', field: 'divisionRank' },
      { label: 'Team', field: 'team.name' },
      { label: 'W', field: 'leagueRecord.wins' },
      { label: 'L', field: 'leagueRecord.losses' },
      { label: '%', field: 'leagueRecord.pct' },
      { label: 'GB', field: 'gamesBack' },
      { label: 'WC', field: 'wildCardGamesBack' },
      { label: 'RS', field: 'runsScored' },
      { label: 'RA', field: 'runsAllowed' },
      { label: 'Δ', field: 'runDifferential' },
    ];
  }
}

export default class Standings extends Component {
  <template>
    <div class='bg-stone-800 rounded-md my-4 w-full'>
      <div
        class='text-center text-2xl font-bold mb-2 p-4 bg-stone-900 rounded-t-md'
      >
        {{yield}}
      </div>
      <div
        class='p-4 flex flex-row md:items-center md:justify-around flex-wrap gap-2 rounded-b-md'
      >
        <StandingsTable
          @standings={{@league.west}}
          @onHeaderClick={{this.updateSelected}}
        />
        <StandingsTable
          @standings={{@league.central}}
          @onHeaderClick={{this.updateSelected}}
        />
        <StandingsTable
          @standings={{@league.east}}
          @onHeaderClick={{this.updateSelected}}
        />
      </div>
      {{#if this.chartData}}
        <div class='w-full bg-stone-700 pt-6 p-4 rounded-b-md'>
          <DiffChart
            class='h-[500px] w-full'
            @data={{this.chartData}}
            @enableGridlines={{true}}
          />
        </div>
      {{/if}}
    </div>
  </template>

  @tracked selectedDivision;

  @cached
  get chartData() {
    const divisionId = this.selectedDivision?.id;
    return this.args.diffData.filter((d) => d.team.divisionId === divisionId);
  }

  @action
  updateSelected(team) {
    this.selectedDivision =
      this.selectedDivision?.id === team.id ? undefined : team;
  }
}

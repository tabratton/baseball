import { LinkTo } from '@ember/routing';
import Component from '@glimmer/component';

import add from 'ember-math-helpers/helpers/add';
import t from 'ember-intl/helpers/t';

import PlayerName from './player-name';
import SortableTable from './sortable-table';

class Batters extends Component {
  <template>
    <div class='w-fit'>
      {{yield to='header'}}
      <SortableTable
        class='border-collapse border-2 border-stone-50 mb-4'
        @items={{@batters}}
        @headers={{this.headers}}
        @headerClasses='bg-stone-800 text-stone-50'
        ...attributes
      >
        <:header as |h|>
          <h.Header class={{h.header.class}}>
            {{h.header.label}}
          </h.Header>
        </:header>
        <:row as |row|>
          <row.Row>
            <row.Cell>{{row.item.battingOrder}}</row.Cell>
            <row.Cell>{{row.item.position}}</row.Cell>
            <row.Cell class='text-left'>
              <LinkTo
                class='hover:underline whitespace-nowrap'
                @route='player'
                @model={{row.item.id}}
              >
                <PlayerName>
                  <:first>{{row.item.firstName}}</:first>
                  <:last>{{row.item.lastName}}</:last>
                </PlayerName>
              </LinkTo>
            </row.Cell>
            <row.Cell
              class='hidden lg:table-cell'
            >{{row.item.number}}</row.Cell>
            <row.Cell>{{row.item.atBats}}</row.Cell>
            <row.Cell>{{row.item.hits}}</row.Cell>
            <row.Cell>{{row.item.runs}}</row.Cell>
            <row.Cell>{{row.item.baseOnBalls}}</row.Cell>
            <row.Cell>{{row.item.rbi}}</row.Cell>
            <row.Cell
              class='hidden lg:table-cell'
            >{{row.item.singles}}</row.Cell>
            <row.Cell
              class='hidden lg:table-cell'
            >{{row.item.doubles}}</row.Cell>
            <row.Cell
              class='hidden lg:table-cell'
            >{{row.item.triples}}</row.Cell>
            <row.Cell>{{row.item.homeRuns}}</row.Cell>
            <row.Cell
              class='hidden lg:table-cell'
            >{{row.item.hitByPitch}}</row.Cell>
            <row.Cell class='hidden lg:table-cell'>{{row.item.avg}}</row.Cell>
            {{! TODO: Configurable list of table columns (advanced stats?) }}
          </row.Row>
        </:row>
      </SortableTable>
    </div>
  </template>

  get headers() {
    return [
      { label: '', field: 'battingOrderSort' },
      { label: 'POS', field: 'position' },
      { label: 'Name', field: 'fullName' },
      { label: '#', field: 'number', class: 'hidden lg:table-cell' },
      { label: 'AB', field: 'atBats' },
      { label: 'H', field: 'hits' },
      { label: 'R', field: 'runs' },
      { label: 'BB', field: 'baseOnBalls' },
      { label: 'RBI', field: 'rbi' },
      { label: '1B', field: 'singles', class: 'hidden lg:table-cell' },
      { label: '2B', field: 'doubles', class: 'hidden lg:table-cell' },
      { label: '3B', field: 'triples', class: 'hidden lg:table-cell' },
      { label: 'HR', field: 'homeRuns' },
      { label: 'HBP', field: 'hitByPitch', class: 'hidden lg:table-cell' },
      { label: 'AVG', field: 'avg', class: 'hidden lg:table-cell' },
    ];
  }
}

class Pitchers extends Component {
  <template>
    <div class='w-fit'>
      {{yield to='header'}}
      <SortableTable
        class='border-collapse border-2 border-stone-50 mb-4'
        @items={{@pitchers}}
        @headers={{this.headers}}
        @headerClasses='bg-stone-800 text-stone-50'
        ...attributes
      >
        <:header as |h|>
          <h.Header class={{h.header.class}}>
            {{h.header.label}}
          </h.Header>
        </:header>
        <:row as |row|>
          <row.Row>
            <row.Cell>#{{add row.index 1}}</row.Cell>
            <row.Cell class='text-left'>
              <LinkTo
                class='hover:underline whitespace-nowrap'
                @route='player'
                @model={{row.item.id}}
              >
                <PlayerName>
                  <:first>{{row.item.firstName}}</:first>
                  <:last>{{row.item.lastName}}</:last>
                </PlayerName>
              </LinkTo>
            </row.Cell>
            <row.Cell
              class='hidden lg:table-cell'
            >{{row.item.number}}</row.Cell>
            <row.Cell>{{row.item.inningsPitched}}</row.Cell>
            <row.Cell>{{row.item.hits}}</row.Cell>
            <row.Cell>{{row.item.earnedRuns}}</row.Cell>
            <row.Cell>{{row.item.strikeOuts}}</row.Cell>
            <row.Cell>{{row.item.baseOnBalls}}</row.Cell>
            <row.Cell
              class='hidden lg:table-cell'
            >{{row.item.balls}}/{{row.item.strikes}}</row.Cell>
            <row.Cell class='hidden lg:table-cell'>{{row.item.era}}</row.Cell>
            {{! TODO: Configurable list of table columns (advanced stats?) }}
          </row.Row>
        </:row>
      </SortableTable>
    </div>
  </template>

  get headers() {
    return [
      { label: '', field: 'index' },
      { label: 'Name', field: 'fullName' },
      { label: '#', field: 'number', class: 'hidden lg:table-cell' },
      { label: 'IP', field: 'inningsPitched' },
      { label: 'H', field: 'hits' },
      { label: 'ER', field: 'earnedRuns' },
      { label: 'K', field: 'strikeOuts' },
      { label: 'BB', field: 'baseOnBalls' },
      { label: 'B/S', field: 'ballsAndStrikes', class: 'hidden lg:table-cell' },
      { label: 'ERA', field: 'era', class: 'hidden lg:table-cell' },
    ];
  }
}

<template>
  <div
    class='flex gap-4 flex-row flex-wrap md:items-start overflow-auto'
    ...attributes
  >
    <div class='flex flex-col mx-auto md:items-center'>
      <Batters
        class='{{@game.awayTeam.bgClass}} {{@game.awayTeam.textClass}}'
        @batters={{@game.awayTeam.batters}}
      >
        <:header>
          <h4
            class='bg-stone-800 border-2 border-b-0 border-stone-50 text-center p-2 text-stone-50 font-bold text-lg'
          >
            {{t 'playerTable.batters_title' team=@game.awayTeam.name}}
          </h4>
        </:header>
      </Batters>
      <Pitchers
        class='{{@game.awayTeam.bgClass}} {{@game.awayTeam.textClass}}'
        @pitchers={{@game.awayTeam.pitchers}}
      >
        <:header>
          <h4
            class='bg-stone-800 border-2 border-b-0 border-stone-50 text-center p-2 text-stone-50 font-bold text-lg'
          >
            {{t 'playerTable.pitchers_title' team=@game.awayTeam.name}}
          </h4>
        </:header>
      </Pitchers>
    </div>
    <div class='flex flex-col mx-auto md:items-center'>
      <Batters
        class='{{@game.homeTeam.bgClass}} {{@game.homeTeam.textClass}}'
        @batters={{@game.homeTeam.batters}}
      >
        <:header>
          <h4
            class='bg-stone-800 border-2 border-b-0 border-stone-50 text-center p-2 text-stone-50 font-bold text-lg'
          >
            {{t 'playerTable.batters_title' team=@game.homeTeam.name}}
          </h4>
        </:header>
      </Batters>
      <Pitchers
        class='{{@game.homeTeam.bgClass}} {{@game.homeTeam.textClass}}'
        @pitchers={{@game.homeTeam.pitchers}}
      >
        <:header>
          <h4
            class='bg-stone-800 border-2 border-b-0 border-stone-50 text-center p-2 text-stone-50 font-bold text-lg'
          >
            {{t 'playerTable.pitchers_title' team=@game.homeTeam.name}}
          </h4>
        </:header>
      </Pitchers>
    </div>
  </div>
</template>

import { LinkTo } from '@ember/routing';
import { mod } from 'ember-math-helpers';
import { eq } from 'ember-truth-helpers';
import { pageTitle } from 'ember-page-title';
import PowerSelect from 'ember-power-select/components/power-select';

import SortableTable from '../components/sortable-table';
import PlayerName from '../components/player-name';

<template>
  {{pageTitle "League Leaders"}}

  <div class="league-leaders h-home w-full overflow-auto">
    <div class="mt-4 flex items-center flex-col p-4 rounded">
      <PowerSelect
        @triggerClass="w-[420px]"
        @search={{@controller.searchCategories.perform}}
        @searchEnabled={{true}}
        @options={{@controller.categories}}
        @selected={{@controller.selectedCategory}}
        @onChange={{@controller.updateCategory}}
        @placeholder="Select a category"
        as |category|
      >
        {{category.label}}
        ({{category.categoryLabel}})
      </PowerSelect>
      <div class="mt-4">
        {{#if @model.allLeaders.length}}
          <SortableTable
            class="border-collapse border-2 border-stone-50 mb-4"
            @items={{@model.allLeaders}}
            @headers={{@controller.headers}}
            @headerClasses="bg-stone-800"
            ...attributes
          >
            <:header as |h|>
              <h.Header class={{h.header.class}}>
                {{h.header.label}}
              </h.Header>
            </:header>
            <:row as |row|>
              <row.Row
                class={{if
                  (eq (mod row.index 2) 0)
                  "bg-stone-700"
                  "bg-stone-800"
                }}
              >
                <row.Cell class="border-r-0">
                  <LinkTo
                    class="hover:underline"
                    @route="player"
                    @model={{row.item.american.person.id}}
                  >
                    <PlayerName>
                      <:first>{{row.item.american.person.firstName}}</:first>
                      <:last>{{row.item.american.person.lastName}}</:last>
                    </PlayerName>
                  </LinkTo>
                </row.Cell>
                <row.Cell class="border-l-0">
                  {{row.item.american.value}}
                </row.Cell>
                <row.Cell>{{row.item.rank}}</row.Cell>
                <row.Cell
                  class="border-r-0"
                >{{row.item.national.value}}</row.Cell>
                <row.Cell class="border-l-0">
                  <LinkTo
                    class="hover:underline"
                    @route="player"
                    @model={{row.item.national.person.id}}
                  >
                    <PlayerName>
                      <:first>{{row.item.national.person.firstName}}</:first>
                      <:last>{{row.item.national.person.lastName}}</:last>
                    </PlayerName>
                  </LinkTo>
                </row.Cell>
              </row.Row>
            </:row>
          </SortableTable>
        {{/if}}
      </div>
    </div>
  </div>
</template>

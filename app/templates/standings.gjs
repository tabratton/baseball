import { fn } from '@ember/helper';
import { t } from 'ember-intl';
import { pageTitle } from 'ember-page-title';

import DatePicker from '../components/date-picker';
import Standings from '../components/standings';
import PlayoffsBracket from '../components/playoffs-bracket';

<template>
  {{pageTitle "Standings"}}

  <div class="standings h-home w-full">
    <div class="flex items-center justify-center">
      <DatePicker
        @date={{@controller.selectedDate}}
        @maxDate={{@controller.maxDate}}
        @onUpdate={{fn (mut @controller.selectedDate)}}
      />
    </div>
    {{#if @controller.isRegularSeason}}
      <Standings
        @league={{@model.standings.american}}
        @diffData={{@model.winDifferentials}}
      >
        {{t "standings.american.title"}}
      </Standings>
      <Standings
        @league={{@model.standings.national}}
        @diffData={{@model.winDifferentials}}
      >
        {{t "standings.national.title"}}
      </Standings>
    {{else if @controller.isPostSeason}}
      <div class="overflow-auto">
        <PlayoffsBracket @model={{@model.postSeason}} />
      </div>
    {{/if}}
  </div>
</template>

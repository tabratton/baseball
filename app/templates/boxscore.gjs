import { formatDate } from 'ember-intl';
import { pageTitle } from 'ember-page-title';

import Boxscore from '../components/boxscore';
import Players from '../components/players';
import Scorebug from '../components/scorebug';

import gameRefresher from '../modifiers/game-refresher';

<template>
  {{pageTitle
    @model.awayTeam.teamName
    " at "
    @model.homeTeam.teamName
    " - "
    (formatDate @model.gameTime)
  }}

  <div class="overflow-auto w-full h-home" {{gameRefresher @model}}>
    {{#if @model.inProgress}}
      <div class="flex overflow-auto md:justify-center">
        <Scorebug class="mx-auto" @game={{@model}} @disableClick={{true}} />
      </div>
    {{/if}}
    <div class="flex overflow-auto my-4">
      <Boxscore class="mx-auto" @game={{@model}} />
    </div>
    <Players class="w-full mb-4" @game={{@model}} />
  </div>
</template>
